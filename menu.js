var menuState = {
    create: function(){

        var guiMenu = game.add.sprite(game.world.centerX, game.world.centerY, 'menuScreen');
        var guiLoadCharacter = game.add.sprite(game.world.centerX, game.world.centerY * 1.2, 'loadCharacterButton');
        guiMenu.anchor.set(0.5);
        guiLoadCharacter.anchor.set(0.5);
        guiLoadCharacter.inputEnabled = true;
        guiLoadCharacter.events.onInputDown.add(listener, this);

        isMultiInit = false;
        loadTime = null;

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

    }
}

function listener() {
    game.state.start('main');
}