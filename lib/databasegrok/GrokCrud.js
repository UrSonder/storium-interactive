(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.GrokCrud = {}));
})(this, function (exports) {
  'use strict';

  // Branchless utility functions (simplified from AdvancedCrudLib)
  const BranchlessUtils = {
    select: (condition, trueVal, falseVal) => {
      const mask = -(!!condition);
      return (trueVal & mask) | (falseVal & ~mask);
    },
    nullDefault: (value, defaultVal) => {
      const isNull = +(value == null);
      return BranchlessUtils.select(isNull, defaultVal, value);
    },
    boundedIndex: (index, length) => {
      const inBounds = +(index >= 0 && index < length);
      return BranchlessUtils.select(inBounds, index, -1);
    }
  };

  // Lookup tables for operations and validations
  const LookupTables = {
    operationTypes: ['create', 'read', 'update', 'delete'],
    validationCodes: {
      SUCCESS: 0,
      FK_VIOLATION: 1,
      NULL_CONSTRAINT: 2,
      UNIQUE_VIOLATION: 3,
      NOT_FOUND: 4
    },
    validationMessages: [
      'Success',
      'Foreign key constraint violation',
      'Null constraint violation',
      'Unique constraint violation',
      'Record not found'
    ]
  };

  class GrokCrud {
    constructor(database) {
      this.db = database; // Database from databasegrok.js
      this.metadata = new Map(); // { tableName: { primaryKey, fields, foreignKeys, children, displayField } }
      this.depthCache = new Map();
      this.operationLookup = new Map();
      this._initializeOperationLookup();
    }

    // Initialize operation dispatch lookup
    _initializeOperationLookup() {
      this.operationLookup.set('create', this._executeCreate.bind(this));
      this.operationLookup.set('read', this._executeRead.bind(this));
      this.operationLookup.set('update', this._executeUpdate.bind(this));
      this.operationLookup.set('delete', this._executeDelete.bind(this));
    }

    // Define table metadata
    define(tableName, meta) {
      const normalizedName = this._normalize(tableName);
      const enhancedMeta = {
        primaryKey: 'id',
        fields: ['id', ...(meta.fields || [])],
        foreignKeys: new Map(meta.foreignKeys ? Object.entries(meta.foreignKeys) : []),
        children: new Set(meta.children || []),
        displayField: meta.displayField || null,
        depth: 0
      };
      this.metadata.set(normalizedName, enhancedMeta);
      this.db.tables.addTable(normalizedName, enhancedMeta.fields, meta.unique || []);
      this._calculateDepths();
    }

    // Calculate table depths for dependency sorting
    _calculateDepths(visited = new Set()) {
      const calculateDepth = (tableName, calculating = new Set()) => {
        if (calculating.has(tableName)) throw new Error(`Circular dependency: ${tableName}`);
        if (this.depthCache.has(tableName)) return this.depthCache.get(tableName);
        calculating.add(tableName);
        const meta = this.metadata.get(tableName);
        const maxDepth = meta?.foreignKeys.size ? Array.from(meta.foreignKeys.values())
          .reduce((max, parentTable) => {
            const parentDepth = this.metadata.has(parentTable) ? calculateDepth(parentTable, calculating) + 1 : 0;
            return Math.max(max, parentDepth);
          }, 0) : 0;
        meta.depth = maxDepth;
        this.depthCache.set(tableName, maxDepth);
        calculating.delete(tableName);
        visited.add(tableName);
        return maxDepth;
      };
      for (const tableName of this.metadata.keys()) {
        if (!visited.has(tableName)) calculateDepth(tableName);
      }
    }

    // Branchless operation dispatcher
    execute(operation, tableName, ...args) {
      const handler = this.operationLookup.get(operation);
      const validOperation = +(handler != null);
      return BranchlessUtils.select(
        validOperation,
        () => handler(tableName, ...args),
        () => { throw new Error(`Unknown operation: ${operation}`); }
      );
    }

    // Create with foreign key validation
    _executeCreate(tableName, obj) {
      const normalizedName = this._normalize(tableName);
      const validationResult = this._validateForeignKeys(normalizedName, obj);
      const isValid = +(validationResult === LookupTables.validationCodes.SUCCESS);
      return BranchlessUtils.select(
        isValid,
        () => this.db.create(normalizedName, obj),
        () => { throw new Error(this._getValidationErrorMessage(validationResult)); }
      );
    }

    // Functional read
    _executeRead(tableName, filter = {}) {
      const normalizedName = this._normalize(tableName);
      const rs = this.db.read(normalizedName, filter);
      return rs.toArray().map(arr => this._rowToObject(normalizedName, arr));
    }

    // Update with validation
    _executeUpdate(tableName, id, updates) {
      const normalizedName = this._normalize(tableName);
      const pk = this._pkOf(normalizedName);
      const cleanUpdates = { ...updates };
      delete cleanUpdates[pk];
      const validationResult = this._validateForeignKeys(normalizedName, cleanUpdates);
      const isValid = +(validationResult === LookupTables.validationCodes.SUCCESS);
      BranchlessUtils.select(
        isValid,
        () => this.db.update(normalizedName, id, cleanUpdates),
        () => { throw new Error(this._getValidationErrorMessage(validationResult)); }
      );
    }

    // Delete with cascading
    _executeDelete(tableName, id) {
      const normalizedName = this._normalize(tableName);
      const dependents = this._getDependentRecords(normalizedName, id);
      const sortedDependents = this._sortByDepthDescending(dependents);
      this._cascadeDelete(sortedDependents);
      this.db.delete(normalizedName, id);
    }

    // Foreign key validation
    _validateForeignKeys(tableName, obj) {
      const meta = this.metadata.get(tableName);
      const hasKeys = +(meta?.foreignKeys?.size > 0);
      if (!hasKeys) return LookupTables.validationCodes.SUCCESS;
      return Array.from(meta.foreignKeys.entries()).reduce((acc, [col, fkTable]) => {
        const val = obj[col];
        const isNull = +(val == null);
        if (isNull) return acc;
        const pk = this._pkOf(fkTable);
        const rows = this.db.read(fkTable, { [pk]: val }).toArray();
        const exists = +(rows.length > 0);
        return BranchlessUtils.select(
          exists && acc === LookupTables.validationCodes.SUCCESS,
          LookupTables.validationCodes.SUCCESS,
          LookupTables.validationCodes.FK_VIOLATION
        );
      }, LookupTables.validationCodes.SUCCESS);
    }

    // Discover dependent records
    _getDependentRecords(tableName, id, visited = new Set()) {
      const key = `${tableName}:${id}`;
      if (visited.has(key)) return new Map();
      visited.add(key);
      const dependents = new Map();
      const childTables = Array.from(this.metadata.keys()).filter(childTable =>
        Array.from(this.metadata.get(childTable)?.foreignKeys?.values() || []).includes(tableName)
      );
      childTables.forEach(childTable => {
        const childMeta = this.metadata.get(childTable);
        const foreignKeyColumns = Array.from(childMeta.foreignKeys.entries())
          .filter(([col, fkTable]) => fkTable === tableName)
          .map(([col]) => col);
        foreignKeyColumns.forEach(col => {
          const childRows = this.db.read(childTable, { [col]: id }).toArray();
          const childIds = new Set(childRows.map(row => row[0]));
          if (childIds.size) dependents.set(childTable, childIds);
          childRows.forEach(row => {
            const childId = row[0];
            const grandChildren = this._getDependentRecords(childTable, childId, visited);
            grandChildren.forEach((ids, table) => {
              const existing = dependents.get(table) || new Set();
              ids.forEach(id => existing.add(id));
              dependents.set(table, existing);
            });
          });
        });
      });
      return dependents;
    }

    // Sort dependents by depth
    _sortByDepthDescending(dependents) {
      return Array.from(dependents.keys())
        .map(table => ({
          table,
          depth: this.metadata.get(table)?.depth || 0,
          ids: dependents.get(table)
        }))
        .sort((a, b) => b.depth - a.depth);
    }

    // Cascade delete
    _cascadeDelete(sortedDependents, index = 0) {
      const hasMore = +(index < sortedDependents.length);
      if (!hasMore) return;
      const { table, ids } = sortedDependents[index];
      ids.forEach(id => this.db.delete(table, id));
      this._cascadeDelete(sortedDependents, index + 1);
    }

    // Resolve display fields
    resolveDisplay(tableName, rowObj) {
      const normalizedName = this._normalize(tableName);
      const meta = this.metadata.get(normalizedName);
      const out = { ...rowObj };
      if (meta?.foreignKeys?.size) {
        for (const [col, fkTable] of meta.foreignKeys) {
          const fkVal = rowObj[col];
          if (fkVal == null) continue;
          const fkMeta = this.metadata.get(fkTable);
          const displayField = fkMeta?.displayField;
          if (displayField) {
            const fkRow = this.get(fkTable, fkVal);
            if (fkRow) out[`${col}_display`] = fkRow[displayField];
          }
        }
      }
      if (meta?.displayField) {
        out._display = meta.displayField.split('+').map(f => f.trim()).map(f => rowObj[f] || '').join(' ');
      }
      return out;
    }

    // Public API
    get(tableName, id) {
      const pk = this._pkOf(tableName);
      const results = this.readAll(tableName, { [pk]: id });
      return BranchlessUtils.select(results.length > 0, results[0], null);
    }

    readAll(tableName, filter = {}) {
      return this.execute('read', tableName, filter);
    }

    create(tableName, obj) {
      return this.execute('create', tableName, obj);
    }

    update(tableName, id, updates) {
      return this.execute('update', tableName, id, updates);
    }

    delete(tableName, id) {
      return this.execute('delete', tableName, id);
    }

    // Helper methods
    _pkOf(tableName) {
      const normalizedName = this._normalize(tableName);
      const meta = this.metadata.get(normalizedName);
      return BranchlessUtils.nullDefault(meta?.primaryKey, 'id');
    }

    _normalize(name) {
      return name.startsWith('tbl') ? name : 'tbl' + name;
    }

    _rowToObject(tableName, arr) {
      const normalizedName = this._normalize(tableName);
      const table = this.db.tables.getTable(normalizedName);
      return table.columns.names.reduce((obj, name, index) => {
        obj[name] = arr[index];
        return obj;
      }, {});
    }

    _getValidationErrorMessage(code) {
      const validIndex = BranchlessUtils.boundedIndex(code, LookupTables.validationMessages.length);
      return BranchlessUtils.select(
        validIndex >= 0,
        LookupTables.validationMessages[code],
        'Unknown validation error'
      );
    }
  }

  exports.GrokCrud = GrokCrud;
  exports.BranchlessUtils = BranchlessUtils;
  exports.LookupTables = LookupTables;
});