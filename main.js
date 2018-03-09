
///Main Game 'World' script//

var chatInput;
var chatBox;
var chatLog = "TestMessage says: TeStTeStTeStTeStTeSt TeStTeSt TeStTeStTeSt";
var statsPage;
var pageButtons;

var statusBars = {
    hp:{
        hpBar: null,
        healthBarObject: null,
        healthBarText: null,
    },
    fp:{
        fpBar: null,
        focusBarObject: null,
        focusBarText: null,
    },
    sp:{
        spBar: null,
        staminaBarObject: null,
    }
}

var mainState = {
    create: function(){

        initMultiPlayer(game, game.global);

        //tell server client is ready
        game.global.eurecaProxy.initPlayer(game.global.myId);

        //game.physics.startSystem(Phaser.Physics.ARCADE);

        //Maps and layers
        game.global.mapManager = new MapManager(game);

        //GUI
        var leftPanel = game.add.sprite(0, game.world.bottom * 0.099, 'leftPanel');
        var topPanel = game.add.sprite(0, 0, 'topPanel');
        var rightMiddlePanel = game.add.sprite(game.world.width * 0.88, game.world.centerY * 0.627, 'rightMiddlePanel');
        rightMiddlePanel.anchor.set(0.5);
        var rightPanel = game.add.sprite(game.world.width * 0.7063, 0, 'rightPanel');
        var bottomPanel = game.add.sprite(game.world.centerX * 0.7475, game.world.bottom * 0.8365, 'bottomPanel');
        bottomPanel.anchor.set(0.5);

        pageButtons = game.add.group();
        var statsButtonInactive = game.add.sprite(game.world.width * 0.77, game.world.centerY * 0.071, 'statsButtonInactive');
        pageButtons.add(statsButtonInactive);

        //Stats Page
        statsPage = game.add.sprite(game.world.width * 0.725, game.world.centerY * 0.4, 'rightMiddlePanelStats');
        var goldLabel = game.make.text( 100, 15, "0", { font: "bold 14px Arial", fill: "#FFF",  boundsAlignH: "center", boundsAlignV: "middle"} );
        var strengthVal = game.make.text( 30, 45, "0", { font: "bold 14px Arial", fill: "#FFF",  boundsAlignH: "center", boundsAlignV: "middle"} );
        var strengthLabel = game.make.text( 100, 45, "Strength", { font: "bold 14px Arial", fill: "#FFF",  boundsAlignH: "center", boundsAlignV: "middle"} );
        var dexterityVal = game.make.text( 30, 75, "0", { font: "bold 14px Arial", fill: "#FFF",  boundsAlignH: "center", boundsAlignV: "middle"} );
        var dexterityLabel = game.make.text( 100, 75, "Dexterity", { font: "bold 14px Arial", fill: "#FFF",  boundsAlignH: "center", boundsAlignV: "middle"} );
        var enduranceVal = game.make.text( 30, 110, "0", { font: "bold 14px Arial", fill: "#FFF",  boundsAlignH: "center", boundsAlignV: "middle"} );
        var enduranceLabel = game.make.text( 100, 110, "Endurance", { font: "bold 14px Arial", fill: "#FFF",  boundsAlignH: "center", boundsAlignV: "middle"} );
        var agilityVal = game.make.text( 30, 140, "0", { font: "bold 14px Arial", fill: "#FFF",  boundsAlignH: "center", boundsAlignV: "middle"} );
        var agilityLabel = game.make.text( 100, 140, "Agility", { font: "bold 14px Arial", fill: "#FFF",  boundsAlignH: "center", boundsAlignV: "middle"} );
        var arcaneVal = game.make.text( 30, 173, "0", { font: "bold 14px Arial", fill: "#FFF",  boundsAlignH: "center", boundsAlignV: "middle"} );
        var arcaneLabel = game.make.text( 100, 173, "Arcane", { font: "bold 14px Arial", fill: "#FFF",  boundsAlignH: "center", boundsAlignV: "middle"} );
        var luckVal = game.make.text( 30, 207, "0", { font: "bold 14px Arial", fill: "#FFF",  boundsAlignH: "center", boundsAlignV: "middle"} );
        var luckLabel = game.make.text( 100, 207, "Luck", { font: "bold 14px Arial", fill: "#FFF",  boundsAlignH: "center", boundsAlignV: "middle"} );
        statsPage.addChild(goldLabel);
        statsPage.addChild(strengthVal);
        statsPage.addChild(strengthLabel);
        statsPage.addChild(dexterityVal);
        statsPage.addChild(dexterityLabel);
        statsPage.addChild(enduranceVal);
        statsPage.addChild(enduranceLabel);
        statsPage.addChild(agilityVal);
        statsPage.addChild(agilityLabel);
        statsPage.addChild(arcaneVal);
        statsPage.addChild(arcaneLabel);
        statsPage.addChild(luckVal);
        statsPage.addChild(luckLabel);

        //ChatBox
        chatBox = game.add.existing(new ScrollableArea(game.world.width * 0.022, game.world.bottom * 0.76, 762, 88));
        var textStyle = {font:"bold 14px Arial", fill:"white"};
        var text = game.make.text(0, 0, chatLog, textStyle);
        chatBox.addChild(text);
        chatBox.start();
        
        //Chat Input for player
        chatInput = game.add.inputField(game.world.width * 0.022, game.world.bottom * 0.9251, {
            backgroundColor: '#494745',
            fill: 'white',
            width: 762,
            height: 20,
            max: 95,
        });
        $(chatInput.domElement.element).on('keyup', function (e) {
            if (e.keyCode == 13) {
                if(chatInput.value != undefined && chatInput.value != ''){
                    if(chatInput.value.charAt(0) == "'"){
                        game.global.actionQueue.push({action: {type: 'broadcast', payload: chatInput.value.substring(1)}, target: 'all'});
                    }
                    else{
                        game.global.actionQueue.push({action: {type: 'broadcast', payload: chatInput.value}, target: 'local'});
                    }
                    chatInput.setText('');
                }
            }
        });

        statusBars.hp.hpBar = {
            pos: {
                x: game.world.width * 0.746,
                y: game.world.centerY * 0.2275
            },
            size: {
                w: 193,
                h: 8,
                _1p: 0 /// will be calculated later
            },
            fill_c: 0xff0000,
            border_c: 0x990000,
            alpha: 0.7
        };
        statusBars.hp.hpBar.size._1p = statusBars.hp.hpBar.size.w * 0.01; ///// 1% of width ///
        
        statusBars.hp.healthBarObject = game.add.graphics( statusBars.hp.hpBar.pos.x, statusBars.hp.hpBar.pos.y ); 
        statusBars.hp.healthBarText = game.make.text( 0 , 0, "", { font: "bold 10px Arial", fill: "#FFF",  boundsAlignH: "center", boundsAlignV: "middle" } );
        statusBars.hp.healthBarText.setTextBounds(0, 2, statusBars.hp.hpBar.size.w, statusBars.hp.hpBar.size.h);
        statusBars.hp.healthBarObject.addChild(statusBars.hp.healthBarText);

        statusBars.fp.fpBar = {
            pos: {
                x: game.world.width * 0.746,
                y: game.world.centerY * 0.2785
            },
            size: {
                w: 193,
                h: 8,
                _1p: 0 /// will be calculated later
            },
            fill_c: 0x0000ff,
            border_c: 0x000099,
            alpha: 0.7
        };
        statusBars.fp.fpBar.size._1p = statusBars.fp.fpBar.size.w * 0.01; ///// 1% of width ///
        
        statusBars.fp.focusBarObject = game.add.graphics( statusBars.fp.fpBar.pos.x, statusBars.fp.fpBar.pos.y ); 
        statusBars.fp.focusBarText = game.make.text( 0 , 0, "", { font: "bold 10px Arial", fill: "#FFF",  boundsAlignH: "center", boundsAlignV: "middle"} );
        statusBars.fp.focusBarText.setTextBounds(0, 2, statusBars.fp.fpBar.size.w, statusBars.fp.fpBar.size.h);
        statusBars.fp.focusBarObject.addChild(statusBars.fp.focusBarText);

        statusBars.sp.spBar = {
            pos: {
                x: game.world.width * 0.746,
                y: game.world.centerY * 0.3325
            },
            size: {
                w: 193,
                h: 8,
                _1p: 0 /// will be calculated later
            },
            fill_c: 0xffffff,
            border_c: 0xa6a6a6,
            alpha: 0.7
        };
        statusBars.sp.spBar.size._1p = statusBars.sp.spBar.size.w * 0.01; ///// 1% of width ///
        
        statusBars.sp.staminaBarObject = game.add.graphics( statusBars.sp.spBar.pos.x, statusBars.sp.spBar.pos.y );


        /* var guiGoldIcon = game.add.sprite(game.world.width * 0.88, game.world.centerY * 0.627, 'goldSprites');
        guiGoldIcon.frame = 9; */

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

        //Only allow messages within the "sweet spot" to be visible
        chatBox.forEach((child) => {
            if(child.worldPosition.y < 450 || child.worldPosition.y > 542){
                child.alpha = 0;
            }
            else{
                child.alpha = 1;
            }
        });

        //wait [0.25] seconds after last update before requesting an update from the server
        if (game.global.player.lastUpdated + 250 < currentTime.getTime() ){
            
            game.global.eurecaProxy.requestUpdate(game.global.myId);
        }

        if(game.global.localPlayerObject != null || game.global.localPlayerObject != {}){
            game.global.localPlayerObject.update();    //update player
        }

        //Send queued actions to server
        for(var i in game.global.actionQueue){
            sendMessageToServer(game.global.actionQueue[i].action, game.global.actionQueue[i].target);
            game.global.actionQueue.pop();
        }

        //Move all the other players
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

    //Recieve Message to add to chatBox
    client.exports.recieveBroadcast = function(message, color) {
        var textStyle = {font: "14px Arial", fill: color};
        var text = game.make.text(0, chatBox.length * 22, message, textStyle);
        chatBox.addChild(text);
        if(chatBox.getChildAt(chatBox.length - 1).position.y > 85){
            chatBox.scrollTo(0, chatBox.getChildAt(chatBox.length - 1).position.y, 10);
        }
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
            updateHealthBar((state.health / state.maxHealth) * 100);
            updateFocusBar((state.focus / state.maxFocus) * 100);
            updateStaminaBar(state.stamina);
            updateStatsPage([state.gold, state.strength, state.dexterity, state.endurance, state.agility, state.arcane, state.luck, state.exp]);
            
            statusBars.hp.healthBarText.setText( state.health );
            statusBars.fp.focusBarText.setText( state.focus );
        }
        else{
            //just update references

            globals.player = state;
            globals.playerList[state.playerId].player = state;
            updateHealthBar((state.health / state.maxHealth) * 100);
            updateFocusBar((state.focus / state.maxFocus) * 100);
            updateStaminaBar(state.stamina);
            updateStatsPage([state.gold, state.strength, state.dexterity, state.endurance, state.agility, state.arcane, state.luck, state.exp]);
            
            statusBars.hp.healthBarText.setText( state.health );
            statusBars.fp.focusBarText.setText( state.focus );

            for(var i in state.playersVisible){
                if(globals.playerList[state.playersVisible[i].playerId] == undefined){
                    globals.playerList[state.playersVisible[i].playerId] = {player: state.playersVisible[i], localPlayerObject: null};
                    globals.playerList[state.playersVisible[i].playerId].localPlayerObject = new PlayerObject(state.playersVisible[i].playerId, game);
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

//Function that sends player actions to server
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

updateHealthBar = function( hpPercentage ){ //// health percentage 
	statusBars.hp.healthBarObject.clear();
	statusBars.hp.healthBarObject.lineStyle( 2, statusBars.hp.hpBar.border_c, statusBars.hp.hpBar.alpha );
	statusBars.hp.healthBarObject.beginFill( statusBars.hp.hpBar.fill_c, statusBars.hp.hpBar.alpha );
	statusBars.hp.healthBarObject.drawRect( 0, 0, hpPercentage * statusBars.hp.hpBar.size._1p , statusBars.hp.hpBar.size.h );
	statusBars.hp.healthBarObject.endFill();
}

updateFocusBar = function( fpPercentage ){ //// focus percentage 
	statusBars.fp.focusBarObject.clear();
	statusBars.fp.focusBarObject.lineStyle( 2, statusBars.fp.fpBar.border_c, statusBars.fp.fpBar.alpha );
	statusBars.fp.focusBarObject.beginFill( statusBars.fp.fpBar.fill_c, statusBars.fp.fpBar.alpha );
	statusBars.fp.focusBarObject.drawRect( 0, 0, fpPercentage * statusBars.fp.fpBar.size._1p , statusBars.fp.fpBar.size.h );
	statusBars.fp.focusBarObject.endFill();
}

updateStaminaBar = function( spPercentage ){ //// focus percentage 
	statusBars.sp.staminaBarObject.clear();
	statusBars.sp.staminaBarObject.lineStyle( 2, statusBars.sp.spBar.border_c, statusBars.sp.spBar.alpha );
	statusBars.sp.staminaBarObject.beginFill( statusBars.sp.spBar.fill_c, statusBars.sp.spBar.alpha );
	statusBars.sp.staminaBarObject.drawRect( 0, 0, spPercentage * statusBars.sp.spBar.size._1p , statusBars.sp.spBar.size.h );
	statusBars.sp.staminaBarObject.endFill();
}

updateStatsPage = function(values){
    statsPage.getChildAt(0).setText(values[0]); //gold
    statsPage.getChildAt(1).setText(values[1]); //str
    statsPage.getChildAt(3).setText(values[2]); //dex
    statsPage.getChildAt(5).setText(values[3]); //end
    statsPage.getChildAt(7).setText(values[4]); //agi
    statsPage.getChildAt(9).setText(values[5]); //arc
    statsPage.getChildAt(11).setText(values[6]); //luck
    //statsPage.getChildAt(13).setText(values[7] + ' / 100'); //exp
}