
///Main Game 'World' script//

var chatInput;
var chatBox;
var chatLog = "TestMessage says: TeStTeStTeStTeStTeSt TeStTeSt TeStTeStTeSt";
var scroller;
var cropRect;
var mask;

var mainState = {
    create: function(){

        initMultiPlayer(game, game.global);

        //tell server client is ready
        game.global.eurecaProxy.initPlayer(game.global.myId);

        //game.physics.startSystem(Phaser.Physics.ARCADE);

        //Maps and layers
        game.global.mapManager = new MapManager(game);
        var leftPanel = game.add.sprite(0, game.world.bottom * 0.099, 'leftPanel');
        var topPanel = game.add.sprite(0, 0, 'topPanel');
        var rightMiddlePanel = game.add.sprite(game.world.width * 0.88, game.world.centerY * 0.627, 'rightMiddlePanel');
        rightMiddlePanel.anchor.set(0.5);
        var rightPanel = game.add.sprite(game.world.width * 0.7063, 0, 'rightPanel');
        var bottomPanel = game.add.sprite(game.world.centerX * 0.7475, game.world.bottom * 0.8365, 'bottomPanel');
        bottomPanel.anchor.set(0.5);

        /* chatBox = game.add.inputField(game.world.width * 0.022, game.world.bottom * 0.76, {
            backgroundColor: '#494745',
            fill: 'white',
            width: 762,
            height: 88,
            cursorColor: '#494745',
            type: 'textarea'
        });
        chatBox.domElement.element.type = 'textarea'; */
        /* chatBox.domElement.element.whiteSpace = 'pre-wrap';
        chatBox.domElement.element.style.whiteSpace = 'pre-wrap'; */
        //chatBox.domElement.element.readOnly = true;
        /* chatBox.domElement.element.overflowY = 'scroll';
        chatBox.domElement.element.style.overflowY = 'scroll';
        chatBox.domElement.element.resize = 'none';
        chatBox.domElement.element.style.resize = 'none'; */
        //chatBox.input.useHandCursor = false;
        //chatBox.setTextBounds(16, 16, 300, 762);

        scroller = game.add.existing(new ScrollableArea(game.world.width * 0.022, game.world.bottom * 0.76, 762, 88));

        var textStyle = {font:"bold 14px Arial", fill:"white"};
        var text = game.make.text(0, 0, chatLog, textStyle);
        scroller.addChild(text);
        scroller.start();
        
        chatInput = game.add.inputField(game.world.width * 0.022, game.world.bottom * 0.9251, {
            backgroundColor: '#494745',
            fill: 'white',
            width: 762,
            height: 20,
            max: 95,
        });

        $(chatInput.domElement.element).on('keyup', function (e) {
            if (e.keyCode == 13) {
                // Do something
                game.global.actionQueue.push({action: {type: 'broadcast', payload: chatInput.value}, target: 'local'});
                chatInput.setText('');
            }
        });

        console.log(scroller.mask);
    },

    update: function(){
        var currentTime = new Date();

        if (!game.global.ready || !game.global.player || game.global.localPlayerObject == {} || game.global.eurecaProxy == undefined){
            return; //Stuff isn't ready; hold on...
        }

        if(game.global.lastActionTimestamp + 500000 < currentTime.getTime()){
            //timeout
            client.disconnect();
            console.log("TIMEOUT");
            game.state.start('menu');
        }

        scroller.forEach((child) => {
            if(child.worldPosition.y < 450 || child.worldPosition.y > 542){
                child.alpha = 0;
            }
            else{
                child.alpha = 1;
            }
        });

        //wait [0.5] seconds after last update before requesting an update from the server
        if (game.global.player.lastUpdated + 250 < currentTime.getTime() ){
            
            game.global.eurecaProxy.requestUpdate(game.global.myId);
        }

        if(game.global.localPlayerObject != null || game.global.localPlayerObject != {}){
            game.global.localPlayerObject.update();    //update player
        }

        for(var i in game.global.actionQueue){
            sendMessageToServer(game.global.actionQueue[i].action, game.global.actionQueue[i].target);
            game.global.actionQueue.pop();
        }

        for(var i in game.global.playerList){
            thisPlayer = game.global.playerList[i];
            if(thisPlayer.player != undefined && thisPlayer.localPlayerObject != undefined && thisPlayer.player != game.global.player){
                if(((thisPlayer.player.pos.x + 1) * 32) != thisPlayer.localPlayerObject.playerSprite.x || ((thisPlayer.player.pos.y + 1) * 32) != thisPlayer.localPlayerObject.playerSprite.y){
                    thisPlayer.localPlayerObject.movePlayer(thisPlayer.player.playerId); //update other players
                }
                thisPlayer.localPlayerObject.playerSprite.play(thisPlayer.player.playerAction + '-' + thisPlayer.player.playerFacing);
            }
        }
    },

    render: function(){
        //game.debug.geom( cropRect, 'rgba(255,0,0,1)' ) ;
    }
}

function initMultiPlayer(game, globals){

    client.exports.recieveBroadcast = function(message) {
        //chatLog += '\n' + message;
        //chatBox.setText(chatLog);
        var textStyle = {font:"14px Arial", fill:"white"};
        var text = game.make.text(0, scroller.length * 22, message, textStyle);
        console.log(text);
        scroller.addChild(text);
        console.log(scroller.getChildAt(scroller.length - 1));
        if(scroller.getChildAt(scroller.length - 1).position.y > 85){
            console.log("it is");
            scroller.scrollTo(0, scroller.bottom);
        }
        /* if(text.worldPosition.y > 542){
            console.log("it is");
            scroller.scrollTo(0, scroller.bottom);
        } */
        
        //chatLog += '/n' + message;
    }

    client.exports.recieveStateFromServer = function(state) {

        if(globals.player != null && (globals.player.worldX != state.worldX || globals.player.worldY != state.worldY)){
            //Changed Map after logging in, kill all the sprites, recreate them, and change map

            //Remove old data
            for(var i in globals.playerList){
                globals.playerList[i].localPlayerObject.playerSprite.kill();
                delete globals.playerList[i]
            }

            //Local player
            globals.player = state;
            globals.playerList[state.playerId] = {player: state, localPlayerObject: null};
            globals.localPlayerObject = new PlayerObject(state.playerId, game);
            globals.playerList[state.playerId].localPlayerObject = globals.localPlayerObject;

            //Create the new players
            for(var i in state.playersVisible){
                globals.playerList[state.playersVisible[i].playerId] = {player: state.playersVisible[i], localPlayerObject: null};
                globals.playerList[state.playersVisible[i].playerId].player = state.playersVisible[i];
                globals.playerList[state.playersVisible[i].playerId].localPlayerObject = new PlayerObject(state.playersVisible[i].playerId, game);
            }
            
            globals.mapManager.setMapData(state.mapData);
        }
        else if(state.playerId == globals.myId && globals.localPlayerObject == null && game.global.ready == false){
            //Just logged in, create sprites and map
            
            //Local player
            globals.player = state;
            globals.playerList[state.playerId] = {player: state, localPlayerObject: null};
            globals.localPlayerObject = new PlayerObject(state.playerId, game);
            globals.playerList[state.playerId].localPlayerObject = globals.localPlayerObject;
            globals.lastActionTimestamp = new Date().getTime();
            loadTime = globals.lastActionTimestamp;

            //Create the new players
            for(var i in state.playersVisible){
                globals.playerList[state.playersVisible[i].playerId] = {player: state.playersVisible[i], localPlayerObject: null};
                globals.playerList[state.playersVisible[i].playerId].player = state.playersVisible[i];
                globals.playerList[state.playersVisible[i].playerId].localPlayerObject = new PlayerObject(state.playersVisible[i].playerId, game);
            }

            game.global.ready = true;
            globals.mapManager.setMapData(state.mapData);
        }
        else{
            //just update references

            globals.player = state;
            globals.playerList[state.playerId].player = state;
            for(var i in state.playersVisible){
                if(globals.playerList[state.playersVisible[i].playerId] == undefined){
                    globals.playerList[state.playersVisible[i].playerId] = {player: state.playersVisible[i], localPlayerObject: null};
                    globals.playerList[state.playersVisible[i].playerId].localPlayerObject = new PlayerObject(state.playersVisible[i].playerId, game);
                    console.log('logging in: ', state.playersVisible[i].playerId, globals.playerList[state.playersVisible[i].playerId]);
                }
                else{
                    globals.playerList[state.playersVisible[i].playerId].player = state.playersVisible[i];
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

    if(action.payload != 'I'){ //idle is not an "action" in the sense that it will not reset the timeout
        game.global.lastActionTimestamp = new Date().getTime();
    }  

    game.global.eurecaProxy.message(game.global.myId, {action: action, target: target});
}