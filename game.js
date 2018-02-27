// initialize phaser, call create() once done
var game = new Phaser.Game(800, 600, Phaser.AUTO, null);

game.state.add('boot', bootState);
game.state.add('load', loadState);
game.state.add('menu', menuState);
//game.state.add('newPlayer', newPlayerState);
//game.state.add('loadPlayer', loadPlayerState);
game.state.add('main', mainState);

game.global = {
    player: null, //References for local player state
    playerList: {}, //References for all visible player states and objects
    npcList: {}, //References for all visible NPC states
    ready: false, //We're actually ready to begin normal game cycle
    myId: 0, //Id for server
    myMap: null, //Tiles for current screen
    mapManager: null, //Reference to mapManager for tilemap
    walls: null, //Likely to be factored to 2nd or 3rd layer
    easystar: null,
    localPlayerObject: null, //reference to the Player object of "your" character. Mostly for quick indexing
    eurecaProxy: null, //For our (limited) communication with the server
    actionQueue: [], //Queue of messages to be sent to the server
    lastActionTimestamp: null,
};

var client = null;
var isMultiInit = null;
var loadTime = null;

game.state.start('boot')