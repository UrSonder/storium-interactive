const GameAPI = (function() {
  // ENUMS
  const GameStatus = Object.freeze({
    NOT_STARTED: 0,
    IN_PROGRESS: 1,
    COMPLETED: 2
  });

  const CardCategory = Object.freeze({
    CHARACTER_CARD: 'CHARACTER_CARD',
    NARRATOR_CARD: 'NARRATOR_CARD'
  });

  const CardTypeEnum = Object.freeze({
    STRENGTH: 'STRENGTH',
    WEAKNESS: 'WEAKNESS',
    SUBPLOT: 'SUBPLOT',
    GOAL: 'GOAL',
    ASSET: 'ASSET',
    WILD: 'WILD',
    PLACE: 'PLACE',
    OBSTACLE: 'OBSTACLE',
    CHARACTER: 'CHARACTER'
  });

  const CardTypes = Object.freeze({
    STRENGTH: Object.freeze(new CardType(0, CardTypeEnum.STRENGTH, CardCategory.CHARACTER_CARD)),
    WEAKNESS: Object.freeze(new CardType(1, CardTypeEnum.WEAKNESS, CardCategory.CHARACTER_CARD)),
    SUBPLOT: Object.freeze(new CardType(2, CardTypeEnum.SUBPLOT, CardCategory.CHARACTER_CARD)),
    GOAL: Object.freeze(new CardType(3, CardTypeEnum.GOAL, CardCategory.CHARACTER_CARD)),
    ASSET: Object.freeze(new CardType(4, CardTypeEnum.ASSET, CardCategory.CHARACTER_CARD)),
    WILD: Object.freeze(new CardType(5, CardTypeEnum.WILD, CardCategory.CHARACTER_CARD)),
    PLACE: Object.freeze(new CardType(6, CardTypeEnum.PLACE, CardCategory.NARRATOR_CARD)),
    OBSTACLE: Object.freeze(new CardType(7, CardTypeEnum.OBSTACLE, CardCategory.NARRATOR_CARD)),
    CHARACTER: Object.freeze(new CardType(8, CardTypeEnum.CHARACTER, CardCategory.NARRATOR_CARD))
  });

  // BASE OBJECT
  class BaseObject {
    constructor(id, name, descr) {
      this.id = id;
      this.name = name;
      this.descr = descr;
    }

    getId() {
      return this.id;
    }

    getName() {
      return this.name;
    }

    getDescr() {
      return this.descr;
    }
  }

  // CARD TYPE
  class CardType {
    constructor(index, name, category) {
      this.index = index;
      this.name = name;
      this.category = category;
      Object.freeze(this);
    }

    getIndex() {
      return this.index;
    }
  }

  // PIPS
  class Pips {
    constructor(value, symbol) {
      this.value = value;
      this.symbol = symbol;
      Object.freeze(this);
    }

    getValue() {
      return this.value;
    }
  }

  // CARD
  class Card extends BaseObject {
    constructor(id, name, descr, cardType, pips) {
      super(id, name, descr);
      if (!(cardType instanceof CardType)) throw new Error('Invalid card type');
      this.cardType = cardType;
      this.pips = pips;
      this.isPlayed = false;
      this.wildType = null; // For WILD card type selection
    }

    getCardType() {
      return this.cardType;
    }

    getPipsValue() {
      return this.pips.getValue();
    }
  }

  // CHALLENGE
  class Challenge extends BaseObject {
    constructor(id, name, descr, defaultPip, strongOutcome, weakOutcome) {
      super(id, name, descr);
      this.minPip = 1;
      this.maxPip = 9;
      this.defaultPip = defaultPip;
      this.strongOutcome = strongOutcome;
      this.weakOutcome = weakOutcome;
      this.cardsPlayed = new Map();
      this.isResolved = false;
    }

    determineDefaultPip(unusedPips) {
      return Math.max(this.minPip, Math.min(this.maxPip, unusedPips));
    }

    playObstacle(playerId, card) {
      if (this.isResolved) throw new Error('Challenge already resolved');
      if (card.cardType.category !== CardCategory.NARRATOR_CARD ||
          ![CardTypeEnum.OBSTACLE, CardTypeEnum.CHARACTER].includes(card.cardType.name)) {
        throw new Error('Only OBSTACLE or CHARACTER Narrator Cards can be played as obstacles');
      }
      this.cardsPlayed.set(playerId + '_obstacle', card);
      card.isPlayed = true;
    }

    playCharacterCard(playerId, card) {
      if (this.isResolved) throw new Error('Challenge already resolved');
      if (card.cardType.category !== CardCategory.CHARACTER_CARD) {
        throw new Error('Only Character Cards can be played by players');
      }
      this.cardsPlayed.set(playerId, card);
      card.isPlayed = true;
    }

    resolveChallenge(success) {
      if (this.isResolved) throw new Error('Challenge already resolved');
      this.isResolved = true;
      return success ? this.strongOutcome : this.weakOutcome;
    }
  }

  // PLAYER CHARACTER
  class PlayerCharacter extends BaseObject {
    constructor(id, name, descr, owner) {
      super(id, name, descr);
      this.owner = owner;
      this.remainingCards = [];
      this.playedCards = [];
    }

    useCard(card, wildType = null) {
      const index = this.remainingCards.findIndex(c => c.getId() === card.getId());
      if (index === -1) throw new Error('Card not available');
      if (card.cardType.name === CardTypeEnum.WILD && !wildType) {
        throw new Error('Wild card requires specified type (STRENGTH or WEAKNESS)');
      }
      this.remainingCards.splice(index, 1);
      this.playedCards.push(card);
      card.isPlayed = true;
      if (card.cardType.name === CardTypeEnum.WILD) {
        card.wildType = wildType;
      }
    }

    recoverCard(card) {
      const index = this.playedCards.findIndex(c => c.getId() === card.getId());
      if (index === -1) throw new Error('Card not played');
      this.playedCards.splice(index, 1);
      this.remainingCards.push(card);
      card.isPlayed = false;
      card.wildType = null;
    }

    canPlayCard() {
      return this.remainingCards.length > 0;
    }
  }

  // PLAYER
  class Player extends BaseObject {
    constructor(id, name, descr, isModerator) {
      super(id, name, descr);
      this.isModerator = isModerator;
      this.playerCharacters = [];
      this.hand = [];
    }

    drawCard(card) {
      if (card.cardType.category !== CardCategory.CHARACTER_CARD) {
        throw new Error('Only Character Cards can be drawn by players');
      }
      this.hand.push(card);
      return card;
    }

    playCard(card, wildType = null) {
      const index = this.hand.findIndex(c => c.getId() === card.getId());
      if (index === -1) throw new Error('Card not in hand');
      if (card.cardType.name === CardTypeEnum.WILD && !wildType) {
        throw new Error('Wild card requires specified type (STRENGTH or WEAKNESS)');
      }
      this.hand.splice(index, 1);
      card.isPlayed = true;
      if (card.cardType.name === CardTypeEnum.WILD) {
        card.wildType = wildType;
      }
    }

    assignCharacter(character) {
      this.playerCharacters.push(character);
      character.owner = this;
    }
  }

  // SCENE NODE
  class SceneNode {
    constructor(scene) {
      this.scene = scene;
      this.next = null;
    }
  }

  // SCENE
  class Scene extends BaseObject {
    constructor(id, name, descr, maxPips) {
      super(id, name, descr);
      this.playerCharacters = [];
      this.challenges = [];
      this.maxPips = maxPips;
      this.unusedPips = maxPips;
      this.currentChallenge = null;
      this.placeCard = null;
    }

    setPlace(card) {
      if (card.cardType.name !== CardTypeEnum.PLACE) {
        throw new Error('Scene requires a PLACE card');
      }
      this.placeCard = card;
      card.isPlayed = true;
    }

    startScene() {
      if (!this.placeCard) throw new Error('Scene cannot start without a PLACE card');
      this.unusedPips = this.maxPips;
      this.currentChallenge = this.challenges[0] || null;
    }

    endScene() {
      this.currentChallenge = null;
    }

    addChallenge(challenge) {
      this.challenges.push(challenge);
      if (!this.currentChallenge) {
        this.currentChallenge = challenge;
      }
    }

    updatePips(pipCost) {
      this.unusedPips -= pipCost;
      if (this.unusedPips < 0) {
        this.unusedPips = 0;
      }
    }
  }

  // DIGITAL EXISTENCE (AI Agent)
  class DigitalExistence {
    constructor(agentId, persona, strategyProfile) {
      this.agentId = agentId;
      this.persona = persona;
      this.strategyProfile = strategyProfile;
      this.cards = []; // AI's card pool
    }

    evaluateScene(scene) {
      return scene.challenges.filter(c => !c.isResolved);
    }

    suggestCard(player, scene) {
      if (player.hand.length === 0) return null;
      const challenge = scene.currentChallenge;
      if (!challenge) return player.hand[0];
      const wildType = challenge.defaultPip > 5 ? CardTypeEnum.STRENGTH : CardTypeEnum.WEAKNESS;
      return player.hand.reduce((max, card) => {
        const effectiveType = card.cardType.name === CardTypeEnum.WILD ? wildType : card.cardType.name;
        const score = effectiveType === CardTypeEnum.STRENGTH ? card.getPipsValue() : -card.getPipsValue();
        const maxScore = max.cardType.name === CardTypeEnum.WILD ? wildType : max.cardType.name;
        const maxValue = maxScore === CardTypeEnum.STRENGTH ? max.getPipsValue() : -max.getPipsValue();
        return score > maxValue ? card : max;
      }, player.hand[0]);
    }

    playNarratorCard(scene, card) {
      if (card.cardType.category !== CardCategory.NARRATOR_CARD) {
        throw new Error('AI can only play Narrator Cards as narrator');
      }
      if (card.cardType.name === CardTypeEnum.PLACE) {
        scene.setPlace(card);
      } else if ([CardTypeEnum.OBSTACLE, CardTypeEnum.CHARACTER].includes(card.cardType.name)) {
        if (!scene.currentChallenge) {
          throw new Error('No active challenge to play Narrator Card');
        }
        scene.currentChallenge.playObstacle(this.agentId, card);
      }
    }

    simulatePlay(player, scene) {
      if (player.isModerator) {
        const narratorCard = this.cards.find(c => c.cardType.category === CardCategory.NARRATOR_CARD && !c.isPlayed);
        if (narratorCard) {
          this.playNarratorCard(scene, narratorCard);
        }
      } else {
        const card = this.suggestCard(player, scene);
        if (card && scene.currentChallenge) {
          const wildType = card.cardType.name === CardTypeEnum.WILD
            ? (scene.currentChallenge.defaultPip > 5 ? CardTypeEnum.STRENGTH : CardTypeEnum.WEAKNESS)
            : null;
          player.playCard(card, wildType);
          scene.currentChallenge.playCharacterCard(player.getId(), card);
          scene.updatePips(card.getPipsValue());
        }
      }
    }

    addCard(card) {
      this.cards.push(card);
    }
  }

  // GAME
  class Game extends BaseObject {
    constructor(id, name, descr) {
      super(id, name, descr);
      this.scenes = null;
      this.players = [];
      this.cards = [];
      this.status = GameStatus.NOT_STARTED;
      this.currentSceneNode = null;
    }

    addScene(scene) {
      const node = new SceneNode(scene);
      if (!this.scenes) {
        this.scenes = node;
        this.currentSceneNode = node;
      } else {
        let current = this.scenes;
        while (current.next) {
          current = current.next;
        }
        current.next = node;
      }
    }

    startGame() {
      if (this.status !== GameStatus.NOT_STARTED) {
        throw new Error('Game not in startable state');
      }
      if (!this.scenes || !this.scenes.scene.placeCard) {
        throw new Error('First scene requires a PLACE card');
      }
      this.status = GameStatus.IN_PROGRESS;
      this.currentSceneNode = this.scenes;
    }

    endGame() {
      this.status = GameStatus.COMPLETED;
    }

    nextScene() {
      if (!this.currentSceneNode || !this.currentSceneNode.next) {
        return null;
      }
      this.currentSceneNode = this.currentSceneNode.next;
      return this.currentSceneNode.scene;
    }

    getGameState() {
      return new GameStateTable(this);
    }
  }

  // GAME STATE TABLE
  class GameStateTable {
    constructor(game) {
      this.gameId = game.getId();
      this.status = game.status;
      this.currentScene = game.currentSceneNode ? game.currentSceneNode.scene : null;
      this.players = [...game.players];
      this.scenes = [];
      let node = game.scenes;
      while (node) {
        this.scenes.push(node.scene);
        node = node.next;
      }
      this.cards = [...game.cards];
    }

    generate() {
      return {
        Game: {
          id: this.gameId,
          status: Object.keys(GameStatus).find(key => GameStatus[key] === this.status)
        },
        CurrentScene: this.currentScene ? {
          id: this.currentScene.getId(),
          name: this.currentScene.getName(),
          unusedPips: this.currentScene.unusedPips,
          placeCard: this.currentScene.placeCard ? {
            id: this.currentScene.placeCard.getId(),
            name: this.currentScene.placeCard.getName()
          } : null
        } : null,
        Players: this.players.map(p => ({
          id: p.getId(),
          name: p.getName(),
          isModerator: p.isModerator,
          handSize: p.hand.length,
          characters: p.playerCharacters.map(pc => pc.getName())
        })),
        Scenes: this.scenes.map(s => ({
          id: s.getId(),
          name: s.getName(),
          challenges: s.challenges.length,
          unusedPips: s.unusedPips,
          placeCard: s.placeCard ? s.placeCard.getName() : null
        })),
        Cards: this.cards.map(c => ({
          id: c.getId(),
          name: c.getName(),
          category: c.cardType.category,
          type: c.cardType.name,
          pips: c.getPipsValue(),
          isPlayed: c.isPlayed,
          wildType: c.wildType || null
        }))
      };
    }
  }

  // VALIDATOR
  class GameValidator {
    static validateGame(game) {
      if (!game || !(game instanceof Game)) return false;
      if (![GameStatus.NOT_STARTED, GameStatus.IN_PROGRESS, GameStatus.COMPLETED].includes(game.status)) return false;
      if (!game.scenes || !game.scenes.scene.placeCard) return false;
      return game.players.every(p => this.validatePlayer(p)) &&
             game.cards.every(c => this.validateCard(c)) &&
             this._validateScenes(game.scenes);
    }

    static _validateScenes(node) {
      while (node) {
        if (!this.validateScene(node.scene)) return false;
        node = node.next;
      }
      return true;
    }

    static validateScene(scene) {
      if (!scene || !(scene instanceof Scene)) return false;
      if (!scene.placeCard || scene.placeCard.cardType.name !== CardTypeEnum.PLACE) return false;
      if (typeof scene.maxPips !== 'number' || scene.maxPips < 0) return false;
      return scene.challenges.every(ch => this.validateChallenge(ch));
    }

    static validatePlayer(player) {
      if (!player || !(player instanceof Player)) return false;
      if (typeof player.id !== 'number') return false;
      return player.playerCharacters.every(pc => pc.owner === player) &&
             player.hand.every(c => c.cardType.category === CardCategory.CHARACTER_CARD);
    }

    static validateChallenge(challenge) {
      if (!challenge || !(challenge instanceof Challenge)) return false;
      if (typeof challenge.defaultPip !== 'number' || challenge.defaultPip < challenge.minPip || challenge.defaultPip > challenge.maxPip) return false;
      return true;
    }

    static validateCard(card) {
      if (!card || !(card instanceof Card)) return false;
      if (!card.cardType || typeof card.pips.getValue() !== 'number') return false;
      if (card.cardType.name === CardTypeEnum.WILD && card.isPlayed && !card.wildType) return false;
      return card.cardType.category === CardCategory.CHARACTER_CARD ||
             card.cardType.category === CardCategory.NARRATOR_CARD;
    }
  }

  // Singleton game instance
  let gameInstance = null;

  // Public API
  const api = {};

  api.Types = {
    GameStatus,
    CardCategory,
    CardTypeEnum,
    CardTypes
  };

  api.Cards = {
    createCardType: (index, name, category) => new CardType(index, name, category),
    createPips: (value, symbol) => new Pips(value, symbol),
    createCard: (id, name, descr, cardType, pips) => {
      const card = new Card(id, name, descr, cardType, pips);
      if (gameInstance) gameInstance.cards.push(card);
      return card;
    }
  };

  api.Players = {
    createPlayer: (id, name, descr, isModerator) => {
      const player = new Player(id, name, descr, isModerator);
      if (gameInstance) gameInstance.players.push(player);
      return player;
    },
    createPlayerCharacter: (id, name, descr, owner) => new PlayerCharacter(id, name, descr, owner)
  };

  api.Scenes = {
    createChallenge: (id, name, descr, defaultPip, strongOutcome, weakOutcome) => new Challenge(id, name, descr, defaultPip, strongOutcome, weakOutcome),
    createScene: (id, name, descr, maxPips) => {
      const scene = new Scene(id, name, descr, maxPips);
      if (gameInstance) gameInstance.addScene(scene);
      return scene;
    }
  };

  api.AI = {
    createAgent: (agentId, persona, strategyProfile) => new DigitalExistence(agentId, persona, strategyProfile)
  };

  api.Core = {
    initGame: (id, name, descr) => {
      if (gameInstance) {
        throw new Error('Game already initialized');
      }
      gameInstance = new Game(id, name, descr);
      return gameInstance;
    },
    getGameState: () => {
      if (!gameInstance) {
        throw new Error('No game initialized');
      }
      if (!GameValidator.validateGame(gameInstance)) {
        throw new Error('Invalid game state');
      }
      return gameInstance.getGameState();
    }
  };

  api.Validation = GameValidator;

  return api;
})();
