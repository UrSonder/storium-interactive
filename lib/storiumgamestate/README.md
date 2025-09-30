Storium Game State Library
The Storium Game State Library (GameAPI) is a JavaScript IIFE (Immediately Invoked Function Expression) designed to manage the state of a Storium game, tailored to the specific requirements of tracking playable character cards as described in the provided example from storium.com. The library supports Storium's official card types and categories, with a focus on ensuring that player characters have exactly one Nature card, two Strength cards, two Strength Wild cards, two Weakness cards, two Weakness Wild cards, and three Subplot cards, all of which are playable by players. It tracks which cards have been played versus those that remain unplayed, maintaining immutability, type safety, and extensibility.
Features

Card System: Supports Character Cards (NATURE, STRENGTH, STRENGTH_WILD, WEAKNESS, WEAKNESS_WILD, SUBPLOT, GOAL, ASSET) and Narrator Cards (PLACE, OBSTACLE, CHARACTER). All player character cards are tracked for played/unplayed status.
Game Mechanics: Manages players, player characters, scenes, challenges, and card interactions with strict validation.
AI Integration: Includes a DigitalExistence class for AI-driven card suggestions and play simulation.
Validation: Enforces rules, such as requiring a PLACE card for scenes, ensuring only Character Cards are playable by players, and verifying each player character has the correct card distribution (1 Nature, 2 Strength, 2 Strength Wild, 2 Weakness, 2 Weakness Wild, 3 Subplot).
Structured Output: Provides a getGameState method for a detailed, tabular game state snapshot, including card play status.
Encapsulation: All logic is wrapped in a single IIFE, exposed via the GameAPI namespace.

Installation
Include the GameAPI.js file in your project:
<script src="GameAPI.js"></script>

Usage
The library is accessed via the GameAPI namespace. Below is an example of setting up a game state inspired by the provided Storium character (Narrative Train from Symphony of the Broken Dao), with one player, one player character, one scene, one challenge, one STRENGTH card, and one OBSTACLE card, ensuring the player character has the required card distribution (1 Nature, 2 Strength, 2 Strength Wild, 2 Weakness, 2 Weakness Wild, 3 Subplot).
Example: Game State Setup
// Initialize the game
const game = GameAPI.Core.initGame(1, 'Symphony of the Broken Dao', 'A narrative-driven adventure');

// Create a player (non-moderator)
const player = GameAPI.Players.createPlayer(1, 'FateZNFortune', 'Storyteller', false);

// Create a player character
const character = GameAPI.Players.createPlayerCharacter(1, 'Narrative Train', 'The living, breathing essence of story progression', player);
player.assignCharacter(character);

// Create cards for the player character (1 Nature, 2 Strength, 2 Strength Wild, 2 Weakness, 2 Weakness Wild, 3 Subplot)
const natureCard = GameAPI.Cards.createCard(1, 'Chronological Phantasmagoria', 'The raw potential of unwritten moments', GameAPI.Types.CardTypes.NATURE, GameAPI.Cards.createPips(1, '📜'));
const strengthCard1 = GameAPI.Cards.createCard(2, 'Siren\'s Chorus of Unsung Protagonists', 'Haunting resonance of potential heroes', GameAPI.Types.CardTypes.STRENGTH, GameAPI.Cards.createPips(2, '🎵'));
const strengthCard2 = GameAPI.Cards.createCard(3, 'Siren\'s Chorus of Unsung Protagonists', 'Haunting resonance of potential heroes', GameAPI.Types.CardTypes.STRENGTH, GameAPI.Cards.createPips(2, '🎵'));
const strengthWildCard1 = GameAPI.Cards.createCard(4, 'Strength Wild', 'Fill this in during play', GameAPI.Types.CardTypes.STRENGTH_WILD, GameAPI.Cards.createPips(1, '?'));
const strengthWildCard2 = GameAPI.Cards.createCard(5, 'Strength Wild', 'Fill this in during play', GameAPI.Types.CardTypes.STRENGTH_WILD, GameAPI.Cards.createPips(1, '?'));
const weaknessCard1 = GameAPI.Cards.createCard(6, 'Deus Ex Machina', 'Reality-bending intervention', GameAPI.Types.CardTypes.WEAKNESS, GameAPI.Cards.createPips(1, '⚡'));
const weaknessCard2 = GameAPI.Cards.createCard(7, 'Deus Ex Machina', 'Reality-bending intervention', GameAPI.Types.CardTypes.WEAKNESS, GameAPI.Cards.createPips(1, '⚡'));
const weaknessWildCard1 = GameAPI.Cards.createCard(8, 'Weakness Wild', 'Fill this in during play', GameAPI.Types.CardTypes.WEAKNESS_WILD, GameAPI.Cards.createPips(1, '?'));
const weaknessWildCard2 = GameAPI.Cards.createCard(9, 'Weakness Wild', 'Fill this in during play', GameAPI.Types.CardTypes.WEAKNESS_WILD, GameAPI.Cards.createPips(1, '?'));
const subplotCard1 = GameAPI.Cards.createCard(10, 'Quest for Narrative', 'A personal arc of discovery', GameAPI.Types.CardTypes.SUBPLOT, GameAPI.Cards.createPips(1, '📖'));
const subplotCard2 = GameAPI.Cards.createCard(11, 'Unraveled Fate', 'A tangled thread of destiny', GameAPI.Types.CardTypes.SUBPLOT, GameAPI.Cards.createPips(1, '📖'));
const subplotCard3 = GameAPI.Cards.createCard(12, 'Echoes of the Past', 'A haunting backstory', GameAPI.Types.CardTypes.SUBPLOT, GameAPI.Cards.createPips(1, '📖'));

// Assign cards to the player character
character.addCards([
  natureCard,
  strengthCard1,
  strengthCard2,
  strengthWildCard1,
  strengthWildCard2,
  weaknessCard1,
  weaknessCard2,
  weaknessWildCard1,
  weaknessWildCard2,
  subplotCard1,
  subplotCard2,
  subplotCard3
]);

// Create Narrator cards
const placeCard = GameAPI.Cards.createCard(13, 'Mystic Realm', 'A surreal narrative plane', GameAPI.Types.CardTypes.PLACE, GameAPI.Cards.createPips(0, ''));
const obstacleCard = GameAPI.Cards.createCard(14, 'Narrative Vortex', 'A chaotic twist in the story', GameAPI.Types.CardTypes.OBSTACLE, GameAPI.Cards.createPips(3, '🌀'));

// Create a scene and set its PLACE card
const scene = GameAPI.Scenes.createScene(1, 'Vortex Encounter', 'A battle against narrative chaos', 10);
scene.setPlace(placeCard);

// Create a challenge
const challenge = GameAPI.Scenes.createChallenge(1, 'Navigate Vortex', 'Overcome the chaotic twist', 3, 'Story stabilized', 'Narrative collapse');
scene.addChallenge(challenge);

// Assign the character to the scene
scene.playerCharacters.push(character);

// Play the Obstacle card by a narrator (simulated)
challenge.playObstacle('narrator', obstacleCard);

// Play the Strength card by the player character
character.useCard(strengthCard1);

// Add the scene to the game
game.addScene(scene);

// Start the game
game.startGame();

// Output the game state
console.log(JSON.stringify(GameAPI.Core.getGameState().generate(), null, 2));

Example Game State Output
The getGameState().generate() method produces a structured JSON object representing the game state. For the above setup, the output would look like:
{
  "Game": {
    "id": 1,
    "status": "IN_PROGRESS"
  },
  "CurrentScene": {
    "id": 1,
    "name": "Vortex Encounter",
    "unusedPips": 8,
    "placeCard": {
      "id": 13,
      "name": "Mystic Realm"
    }
  },
  "Players": [
    {
      "id": 1,
      "name": "FateZNFortune",
      "isModerator": false,
      "handSize": 0,
      "characters": [
        "Narrative Train"
      ]
    }
  ],
  "Scenes": [
    {
      "id": 1,
      "name": "Vortex Encounter",
      "challenges": 1,
      "unusedPips": 8,
      "placeCard": "Mystic Realm"
    }
  ],
  "Cards": [
    {
      "id": 1,
      "name": "Chronological Phantasmagoria",
      "category": "CHARACTER_CARD",
      "type": "NATURE",
      "pips": 1,
      "isPlayed": false,
      "wildType": null
    },
    {
      "id": 2,
      "name": "Siren's Chorus of Unsung Protagonists",
      "category": "CHARACTER_CARD",
      "type": "STRENGTH",
      "pips": 2,
      "isPlayed": true,
      "wildType": null
    },
    {
      "id": 3,
      "name": "Siren's Chorus of Unsung Protagonists",
      "category": "CHARACTER_CARD",
      "type": "STRENGTH",
      "pips": 2,
      "isPlayed": false,
      "wildType": null
    },
    {
      "id": 4,
      "name": "Strength Wild",
      "category": "CHARACTER_CARD",
      "type": "STRENGTH_WILD",
      "pips": 1,
      "isPlayed": false,
      "wildType": null
    },
    {
      "id": 5,
      "name": "Strength Wild",
      "category": "CHARACTER_CARD",
      "type": "STRENGTH_WILD",
      "pips": 1,
      "isPlayed": false,
      "wildType": null
    },
    {
      "id": 6,
      "name": "Deus Ex Machina",
      "category": "CHARACTER_CARD",
      "type": "WEAKNESS",
      "pips": 1,
      "isPlayed": false,
      "wildType": null
    },
    {
      "id": 7,
      "name": "Deus Ex Machina",
      "category": "CHARACTER_CARD",
      "type": "WEAKNESS",
      "pips": 1,
      "isPlayed": false,
      "wildType": null
    },
    {
      "id": 8,
      "name": "Weakness Wild",
      "category": "CHARACTER_CARD",
      "type": "WEAKNESS_WILD",
      "pips": 1,
      "isPlayed": false,
      "wildType": null
    },
    {
      "id": 9,
      "name": "Weakness Wild",
      "category": "CHARACTER_CARD",
      "type": "WEAKNESS_WILD",
      "pips": 1,
      "isPlayed": false,
      "wildType": null
    },
    {
      "id": 10,
      "name": "Quest for Narrative",
      "category": "CHARACTER_CARD",
      "type": "SUBPLOT",
      "pips": 1,
      "isPlayed": false,
      "wildType": null
    },
    {
      "id": 11,
      "name": "Unraveled Fate",
      "category": "CHARACTER_CARD",
      "type": "SUBPLOT",
      "pips": 1,
      "isPlayed": false,
      "wildType": null
    },
    {
      "id": 12,
      "name": "Echoes of the Past",
      "category": "CHARACTER_CARD",
      "type": "SUBPLOT",
      "pips": 1,
      "isPlayed": false,
      "wildType": null
    },
    {
      "id": 13,
      "name": "Mystic Realm",
      "category": "NARRATOR_CARD",
      "type": "PLACE",
      "pips": 0,
      "isPlayed": true,
      "wildType": null
    },
    {
      "id": 14,
      "name": "Narrative Vortex",
      "category": "NARRATOR_CARD",
      "type": "OBSTACLE",
      "pips": 3,
      "isPlayed": true,
      "wildType": null
    }
  ]
}

API Reference

GameAPI.Types: Exposes GameStatus, CardCategory, CardTypeEnum, and CardTypes for type safety.
GameAPI.Cards: Methods to create CardType, Pips, and Card instances.
GameAPI.Players: Methods to create Player and PlayerCharacter instances, with addCards for assigning the required card set.
GameAPI.Scenes: Methods to create Scene and Challenge instances.
GameAPI.AI: Method to create a DigitalExistence AI agent for card suggestions and play simulation.
GameAPI.Core: Methods to initialize the game (initGame) and retrieve the game state (getGameState).
GameAPI.Validation: Validation methods to ensure game, scenes, players, challenges, and cards adhere to rules, including the exact card distribution for player characters.

Notes

The library enforces Storium's rules: PLACE cards are required for scenes, only Narrator Cards (OBSTACLE, CHARACTER) can be played as challenge obstacles, and only Character Cards (NATURE, STRENGTH, STRENGTH_WILD, WEAKNESS, WEAKNESS_WILD, SUBPLOT) are playable by players.
Player characters are assigned exactly 1 Nature, 2 Strength, 2 Strength Wild, 2 Weakness, 2 Weakness Wild, and 3 Subplot cards, tracked for played/unplayed status.
STRENGTH_WILD and WEAKNESS_WILD cards require specifying STRENGTH or WEAKNESS when played.
The GameValidator ensures each player character has the correct card distribution and that played/unplayed status is accurately tracked.
The library is extensible, allowing for additional card types or mechanics if needed.

Contributing
Contributions are welcome! Please submit pull requests or issues to the repository (placeholder for actual repo link).
License
MIT License. See LICENSE file for details.