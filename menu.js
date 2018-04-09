var menuState = {
    create: function(){

        var guiMenu = game.add.sprite(game.world.centerX, game.world.centerY, 'menuScreen');
        var guiLoadCharacter = game.add.sprite(game.world.centerX * 1.02225, game.world.centerY * 1.425, 'loadCharacterButton');
        var guiNewCharacter = game.add.sprite(game.world.centerX, game.world.centerY * 1.5770, 'newCharacterButton');
        guiMenu.anchor.set(0.5);
        guiLoadCharacter.anchor.set(0.5);
        guiNewCharacter.anchor.set(0.5);
        guiLoadCharacter.inputEnabled = true;
        guiNewCharacter.inputEnabled = true;
        guiLoadCharacter.events.onInputDown.add(listenerLoad, this);
        guiNewCharacter.events.onInputDown.add(listenerNew, this);

        isMultiInit = false;
        loadTime = null;
        client = null;

        game.global = {
            player: null, //References for local player state
            playerList: {}, //References for all visible player states and objects
            npcList: {}, //References for all visible NPC states
            ready: false, //We're actually ready to begin normal game cycle
            myId: 0, //Id for server
            myMap: null, //Tiles for current screen
            mapManager: null, //Reference to mapManager for tilemap
            itemManager: null,
            items: {},
            itemLayer: null, //Likely to be factored to 2nd or 3rd layer
            playerLayer: null,
            textLayer: null, //top most layer
            easystar: null,
            localPlayerObject: null, //reference to the Player object of "your" character. Mostly for quick indexing
            eurecaProxy: null, //For our (limited) communication with the server
            actionQueue: [], //Queue of messages to be sent to the server
            lastActionTimestamp: null,
        };

    }
}

function listenerLoad() {
    game.state.start('loadPlayer');
}

function listenerNew() {
    game.state.start('newPlayer');
}