
///Main Game 'World' script//

var mainState = {
    create: function(){
        client = new Eureca.Client();

        initMultiPlayer(game, game.global);

        //game.physics.startSystem(Phaser.Physics.ARCADE);

        //Maps and layers
        game.global.mapManager = new MapManager(game);
    },

    update: function(){
        var currentTime = new Date();

        if(isMultiInit == false && currentTime.getTime() > loadTime + 1500){
            console.log("ERROR: Something did not load correctly, restarting game");
            return this.game.state.restart();
        }

        if (!game.global.ready || !game.global.player || game.global.localPlayerObject == {} || game.global.eurecaProxy == undefined){
            return; //Stuff isn't ready; hold on...
        }

        if(game.global.lastActionTimestamp + 500000 < currentTime.getTime()){
            //timeout
            client.disconnect();
            //isMultiInit = false;
            game.global.ready = false;
            console.log("TIMEOUT");
        }

        //wait [0.5] seconds after last update before requesting an update from the server
        if (game.global.player.lastUpdated + 500 < currentTime.getTime() ){
            //game.global.player.lastUpdated = currentTime.getTime();
            for(var i in game.global.actionQueue){
                sendMessageToServer(game.global.actionQueue[i].action, game.global.actionQueue[i].target);
                game.global.actionQueue.pop();
            }
            game.global.eurecaProxy.requestUpdate(game.global.myId);
        }

        if(game.global.localPlayerObject != null || game.global.localPlayerObject != {}){
            game.global.localPlayerObject.update();    //update player
        }

        for(var i in game.global.playerList){
            thisPlayer = game.global.playerList[i];
            if(thisPlayer.player != undefined && thisPlayer.localPlayerObject != undefined && thisPlayer.player != game.global.player){
                if(((thisPlayer.player.pos.x + 1) * 32) != thisPlayer.localPlayerObject.playerSprite.x || ((thisPlayer.player.pos.y + 1) * 32) != thisPlayer.localPlayerObject.playerSprite.y){
                    thisPlayer.localPlayerObject.movePlayer(thisPlayer.player.playerName); //update other players
                }
                thisPlayer.localPlayerObject.playerSprite.play(thisPlayer.player.playerAction + '-' + thisPlayer.player.playerFacing);
            }
        }
    }
}

function initMultiPlayer(game, globals){

    // Reference to our eureca so we can call functions back on the server
    //var eurecaProxy;

    /**
        * Fires on initial connection
        */
    client.onConnect(function (connection) {
        console.log('Incoming connection', connection);
        isMultiInit = true;

    });
    /**
        * When the connection is established and ready
        * we will set a local variable to the "serverProxy"
        * sent back by the server side.
        */
    client.ready(function (serverProxy) {
        // Local reference to the server proxy to be
        // used in other methods within this module.
        console.log("CLIENT READY");
        console.log(serverProxy);
        globals.eurecaProxy = serverProxy;
    });

    /**
        * This sets the players id that we get from the server
        * It creates the instance of the player, and communicates
        * it's state information to the server.
        */
    client.exports.setId = function(id){
        console.log("Setting Id:" + id);

        // Assign my new connection Id
        globals.myId = id;

        //tell server client is ready
        globals.eurecaProxy.initPlayer(id);

    }

    client.exports.recieveStateFromServer = function(state) {

        if(globals.player != false && (globals.player.worldX != state.worldX || globals.player.worldY != state.worldY)){
            //Changed Map after logging in, kill all the sprites, recreate them, and change map

            //Remove old data
            for(var i in globals.playerList){
                globals.playerList[i].localPlayerObject.playerSprite.kill();
                delete globals.playerList[i]
            }

            //Local player
            globals.player = state;
            globals.playerList[state.playerName] = {player: state, localPlayerObject: null};
            globals.localPlayerObject = new PlayerObject(state.playerName, game);
            globals.playerList[state.playerName].localPlayerObject = globals.localPlayerObject;

            //Create the new players
            for(var i in state.playersVisible){
                globals.playerList[state.playersVisible[i].playerName] = {player: state.playersVisible[i], localPlayerObject: null};
                globals.playerList[state.playersVisible[i].playerName].player = state.playersVisible[i];
                globals.playerList[state.playersVisible[i].playerName].localPlayerObject = new PlayerObject(state.playersVisible[i].playerName, game);
            }
            
            globals.mapManager.setMapData(state.mapData);
        }
        else if(state.playerName == globals.myId && globals.localPlayerObject == null && game.global.ready == false){
            //Just logged in, create sprites and map
            
            //Local player
            globals.player = state;
            globals.playerList[state.playerName] = {player: state, localPlayerObject: null};
            globals.localPlayerObject = new PlayerObject(state.playerName, game);
            globals.playerList[state.playerName].localPlayerObject = globals.localPlayerObject;
            globals.lastActionTimestamp = new Date().getTime();

            //Create the new players
            for(var i in state.playersVisible){
                globals.playerList[state.playersVisible[i].playerName] = {player: state.playersVisible[i], localPlayerObject: null};
                globals.playerList[state.playersVisible[i].playerName].player = state.playersVisible[i];
                globals.playerList[state.playersVisible[i].playerName].localPlayerObject = new PlayerObject(state.playersVisible[i].playerName, game);
            }

            game.global.ready = true;
            globals.mapManager.setMapData(state.mapData);
        }
        else{
            //just update references

            globals.player = state;
            globals.playerList[state.playerName].player = state;
            for(var i in state.playersVisible){
                if(globals.playerList[state.playersVisible[i].playerName] == undefined){
                    globals.playerList[state.playersVisible[i].playerName] = {player: state.playersVisible[i], localPlayerObject: null};
                    globals.playerList[state.playersVisible[i].playerName].localPlayerObject = new PlayerObject(state.playersVisible[i].playerName, game);
                    console.log('logging in: ', state.playersVisible[i].playerName, globals.playerList[state.playersVisible[i].playerName]);
                }
                else{
                    globals.playerList[state.playersVisible[i].playerName].player = state.playersVisible[i];
                }
            }
        }
    }

    /**
        * Called from server when another player "disconnects"
        */
    client.exports.kill = function(id){
        if(globals.playerList[id] != undefined){
            console.log('killing: ', id, globals.playerList[id]);
            globals.playerList[id].localPlayerObject.playerSprite.kill();
            delete globals.playerList[id];
        }
    }

}

sendMessageToServer = function(action, target) {
    if(action == null || action == undefined ||
        action.type == null || action.type == undefined ||
        action.payload == null || action.payload == undefined ||
        target == null || target == undefined){
        console.log("ERROR: Attempted to send invalid message");
        return;
    }
    game.global.player.readyToUpdate = false;

    if(action.payload != 'I'){ //idle is not an "action" in the since that it will not reset the timeout
        game.global.lastActionTimestamp = new Date().getTime();
    }  

    game.global.eurecaProxy.message(game.global.myId, {action: action, target: target});
}