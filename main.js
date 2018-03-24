
///Main Game 'World' script//

var chatInput;
var chatBox;
var chatLog = "TestMessage says: TeStTeStTeStTeStTeSt TeStTeSt TeStTeStTeSt";
var statsPage;
var skillsPage;
var inventoryPage;
var inventoryContext;
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

var playerInventory = {};
var playerInventoryData = {};
var playerEquipment = {
    head: null,
    torso: null,
    right: null,
    left: null,
    legs: null,
    extra: null,
};

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
        var inventoryButtonInactive = game.add.sprite(game.world.width * 0.825, game.world.centerY * 0.073, 'inventoryButtonInactive');
        var skillsButtonInactive = game.add.sprite(game.world.width * 0.885, game.world.centerY * 0.0732, 'skillsButtonInactive');
        var spellsButtonInactive = game.add.sprite(game.world.width * 0.9335, game.world.centerY * 0.056, 'spellsButtonInactive');
        statsButtonInactive.inputEnabled = true;
        inventoryButtonInactive.inputEnabled = true;
        skillsButtonInactive.inputEnabled = true;
        spellsButtonInactive.inputEnabled = true;
        statsButtonInactive.events.onInputDown.add(function(){managePageButtons(0)});
        inventoryButtonInactive.events.onInputDown.add(function(){managePageButtons(1)});
        skillsButtonInactive.events.onInputDown.add(function(){managePageButtons(2)});
        spellsButtonInactive.events.onInputDown.add(function(){managePageButtons(3)});
        pageButtons.add(statsButtonInactive);
        pageButtons.add(inventoryButtonInactive);
        pageButtons.add(skillsButtonInactive);
        pageButtons.add(spellsButtonInactive);
        var statsButtonActive = game.add.sprite(game.world.width * 0.765, game.world.centerY * 0.056, 'statsButtonActive');
        var inventoryButtonActive = game.add.sprite(game.world.width * 0.815, game.world.centerY * 0.051, 'inventoryButtonActive');
        var skillsButtonActive = game.add.sprite(game.world.width * 0.88, game.world.centerY * 0.048, 'skillsButtonActive');
        var spellsButtonActive = game.add.sprite(game.world.width * 0.9235, game.world.centerY * 0.02, 'spellsButtonActive');
        statsButtonActive.alpha = 1;
        inventoryButtonActive.alpha = 0;
        skillsButtonActive.alpha = 0;
        spellsButtonActive.alpha = 0;
        pageButtons.add(statsButtonActive);
        pageButtons.add(inventoryButtonActive);
        pageButtons.add(skillsButtonActive);
        pageButtons.add(spellsButtonActive);

        //Stats Page
        statsPage = game.add.sprite(game.world.width * 0.725, game.world.centerY * 0.4, 'rightMiddlePanelStats');
        var goldLabel = game.make.text( 100, 15, "0", { font: "bold 14px Arial", fill: "#e6e600",  boundsAlignH: "center", boundsAlignV: "middle"} );
        var strengthVal = game.make.text( 30, 45, "0", { font: "bold 14px Arial", fill: "#e6e600",  boundsAlignH: "center", boundsAlignV: "middle"} );
        var strengthLabel = game.make.text( 100, 45, "Strength", { font: "bold 14px Arial", fill: "#FFF",  boundsAlignH: "center", boundsAlignV: "middle"} );
        var dexterityVal = game.make.text( 30, 75, "0", { font: "bold 14px Arial", fill: "#e6e600",  boundsAlignH: "center", boundsAlignV: "middle"} );
        var dexterityLabel = game.make.text( 100, 75, "Dexterity", { font: "bold 14px Arial", fill: "#FFF",  boundsAlignH: "center", boundsAlignV: "middle"} );
        var enduranceVal = game.make.text( 30, 110, "0", { font: "bold 14px Arial", fill: "#e6e600",  boundsAlignH: "center", boundsAlignV: "middle"} );
        var enduranceLabel = game.make.text( 100, 110, "Endurance", { font: "bold 14px Arial", fill: "#FFF",  boundsAlignH: "center", boundsAlignV: "middle"} );
        var agilityVal = game.make.text( 30, 140, "0", { font: "bold 14px Arial", fill: "#e6e600",  boundsAlignH: "center", boundsAlignV: "middle"} );
        var agilityLabel = game.make.text( 100, 140, "Agility", { font: "bold 14px Arial", fill: "#FFF",  boundsAlignH: "center", boundsAlignV: "middle"} );
        var arcaneVal = game.make.text( 30, 173, "0", { font: "bold 14px Arial", fill: "#e6e600",  boundsAlignH: "center", boundsAlignV: "middle"} );
        var arcaneLabel = game.make.text( 100, 173, "Arcane", { font: "bold 14px Arial", fill: "#FFF",  boundsAlignH: "center", boundsAlignV: "middle"} );
        var luckVal = game.make.text( 30, 207, "0", { font: "bold 14px Arial", fill: "#e6e600",  boundsAlignH: "center", boundsAlignV: "middle"} );
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

        //Skills Page
        skillsPage = game.add.existing(new ScrollableArea(game.world.width * 0.765, game.world.centerY * 0.4, 155, 300, { horizontalScroll: false, verticalScroll: true, horizontalWheel: false, verticalWheel: true, kineticMovement: false }));
        skillsPage.maskGraphics.input.useHandCursor = false;
        var textStyle = {font:"bold 14px Arial", fill:"white"};
        skillsPage.addChild(game.make.text(0, skillsPage.length * 22, "Swordsmanship", textStyle));
        skillsPage.addChild(game.make.text(0, skillsPage.length * 22, "Mysticism", textStyle));
        skillsPage.addChild(game.make.text(0, skillsPage.length * 22, "Archery", textStyle));
        skillsPage.addChild(game.make.text(0, skillsPage.length * 22, "Knifeplay", textStyle));
        skillsPage.addChild(game.make.text(0, skillsPage.length * 22, "Blocking", textStyle));
        skillsPage.addChild(game.make.text(0, skillsPage.length * 22, "Pugilism", textStyle));
        skillsPage.addChild(game.make.text(0, skillsPage.length * 22, "Fire Magic", textStyle));
        skillsPage.addChild(game.make.text(0, skillsPage.length * 22, "Water Magic", textStyle));
        skillsPage.addChild(game.make.text(0, skillsPage.length * 22, "Earth Magic", textStyle));
        skillsPage.addChild(game.make.text(0, skillsPage.length * 22, "Wind Magic", textStyle));
        skillsPage.addChild(game.make.text(0, skillsPage.length * 22, "White Magic", textStyle));
        skillsPage.addChild(game.make.text(0, skillsPage.length * 22, "Black Magic", textStyle));
        skillsPage.addChild(game.make.text(0, skillsPage.length * 22, "Heavy Weapons", textStyle));
        skillsPage.addChild(game.make.text(0, skillsPage.length * 22, "Hammer Wielding", textStyle));
        skillsPage.addChild(game.make.text(0, skillsPage.length * 22, "Blunt Weapons", textStyle));
        skillsPage.addChild(game.make.text(0, skillsPage.length * 22, "Staff Fighting", textStyle));
        skillsPage.addChild(game.make.text(0, skillsPage.length * 22, "Axe Fighting", textStyle));
        skillsPage.addChild(game.make.text(0, skillsPage.length * 22, "Fencing", textStyle));
        skillsPage.addChild(game.make.text(0, skillsPage.length * 22, "Short Bows", textStyle));
        skillsPage.addChild(game.make.text(0, skillsPage.length * 22, "Long Bows", textStyle));
        skillsPage.addChild(game.make.text(0, skillsPage.length * 22, "Crossbows", textStyle));
        skillsPage.addChild(game.make.text(0, skillsPage.length * 22, "Mining", textStyle));
        skillsPage.addChild(game.make.text(0, skillsPage.length * 22, "Fishing", textStyle));
        skillsPage.addChild(game.make.text(0, skillsPage.length * 22, "Cooking", textStyle));
        skillsPage.addChild(game.make.text(0, skillsPage.length * 22, "Alchemy", textStyle));
        skillsPage.addChild(game.make.text(0, skillsPage.length * 22, "Farming", textStyle));
        skillsPage.addChild(game.make.text(0, skillsPage.length * 22, "Crafting", textStyle));
        skillsPage.addChild(game.make.text(0, skillsPage.length * 22, "Blacksmithing", textStyle));
        for(var i = 0; i < 28; i++){ //28 skills, loop 28 times
            skillsPage.addChild(game.make.text(120, (skillsPage.length - 28) * 22, "1 (0 / 100)", {font:"bold 14px Arial", fill:"#e6e600"}));
        }
        
        skillsPage.start();
        skillsPage.alpha = 0;

        //Inventory Page
        inventoryPage = game.add.group();
        inventoryPage.add(game.add.sprite(game.world.width * 0.785, game.world.centerY * 0.95, 'equipmentPanel'));
        var inventoryIndex = 0;
        for( var i = 0; i < 4; i++){
            for( var j = 0; j < 4; j++){
                //calculate offset
                var offsetX = j * 45;
                var offsetY = i * 35;
                var item = game.add.sprite((game.world.width * 0.7825) + offsetX, (game.world.centerY * 0.45) + offsetY, 'NOTHING');
                item.inputEnabled = true;
                var itemAmount = game.make.text(15, 11, "1", {font:"bold 10px Arial", fill:"white"});
                itemAmount.alpha = 0;
                item.addChild(itemAmount);
                item.anchor.setTo(0.5);
                inventoryPage.add(item);
                const itemObj = {sprite: item, amount: itemAmount, index: inventoryIndex};

                playerInventory[inventoryIndex] = itemObj
                playerInventory[inventoryIndex].sprite.events.onInputDown.add(function(){openContextMenu(itemObj.index)});
                inventoryIndex++;
            }
        }
        inventoryContext = game.add.group();
        inventoryContext.alpha = 0;
        inventoryPage.addChild(inventoryContext);

        playerEquipment.head = game.add.sprite(game.world.width * 0.8075, game.world.centerY * 1.01, 'NOTHING');
        playerEquipment.right = game.add.sprite(game.world.width * 0.8075, game.world.centerY * 1.14, 'NOTHING');
        playerEquipment.legs = game.add.sprite(game.world.width * 0.8075, game.world.centerY * 1.27, 'NOTHING');
        playerEquipment.torso = game.add.sprite(game.world.width * 0.9325, game.world.centerY * 1.01, 'NOTHING');
        playerEquipment.left = game.add.sprite(game.world.width * 0.9325, game.world.centerY * 1.14, 'NOTHING');
        playerEquipment.extra = game.add.sprite(game.world.width * 0.9325, game.world.centerY * 1.27, 'NOTHING');
        playerEquipment.head.anchor.setTo(0.5);
        playerEquipment.right.anchor.setTo(0.5);
        playerEquipment.legs.anchor.setTo(0.5);
        playerEquipment.torso.anchor.setTo(0.5);
        playerEquipment.left.anchor.setTo(0.5);
        playerEquipment.extra.anchor.setTo(0.5);
        inventoryPage.addChild(playerEquipment.head);
        inventoryPage.addChild(playerEquipment.right);
        inventoryPage.addChild(playerEquipment.legs);
        inventoryPage.addChild(playerEquipment.torso);
        inventoryPage.addChild(playerEquipment.left);
        inventoryPage.addChild(playerEquipment.extra);
        inventoryPage.alpha = 0;

        //ChatBox
        chatBox = game.add.existing(new ScrollableArea(game.world.width * 0.022, game.world.bottom * 0.625, 762, 88));
        chatBox.maskGraphics.input.useHandCursor = true;
        var textStyle = {font:"bold 14px Arial", fill:"white"};
        var text = game.make.text(0, 0, chatLog, textStyle);
        chatBox.addChild(text);
        chatBox.start();
        
        //Chat Input for player
        chatInput = game.add.inputField(game.world.width * 0.022, game.world.bottom * 0.755, {
            backgroundColor: '#494745',
            fill: 'white',
            width: 762,
            height: 20,
            max: 180,
        });
        $(chatInput.domElement.element).on('keyup', function (e) {
            if (e.keyCode == 13) {
                if(chatInput.value != undefined && chatInput.value != ''){
                    if(chatInput.value.charAt(0) == "'"){
                        var bInput = chatInput.value.substring(1);
                        if(bInput.length){
                            game.global.actionQueue.push({action: {type: 'broadcast', payload: bInput}, target: 'all'});
                        }
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

        //Only Skills in the sweet spot to be visible
        skillsPage.forEach((child) => {
            if(child.worldPosition.y < 110 || child.worldPosition.y > 400){
                child.alpha = 0;
            }
            else{
                child.alpha = 1;
            }
        });
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

    client.exports.removeItem = function(locationId){
        globals.items[locationId].kill();
        delete globals.items[locationId];
    }

    client.exports.placeItem = function(item){
        globals.mapManager.spawnItem(item);
    }

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

            for(var i in globals.items){
                globals.items[i].kill();
                delete globals.items[i]
            }

            globals.mapManager.setMapData(state.mapData);

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
        }
        else if(state.playerId == globals.myId && globals.localPlayerObject == null && game.global.ready == false){
            //Just logged in, create sprites and map
            globals.mapManager.setMapData(state.mapData);
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
            updateHealthBar((state.health / state.maxHealth) * 100);
            updateFocusBar((state.focus / state.maxFocus) * 100);
            updateStaminaBar(state.stamina);
            updateStatsPage([state.gold, state.strength, state.dexterity, state.endurance, state.agility, state.arcane, state.luck, state.exp]);

            var playerSkills = [
                { level: state.swordsmanship, current: state.swordsmanshipCurrent, next: state.swordsmanshipNext },
                { level: state.mysticism, current: state.mysticismCurrent, next: state.mysticismNext },
                { level: state.archery, current: state.archeryCurrent, next: state.archeryNext },
                { level: state.knifeplay, current: state.knifeplayCurrent, next: state.knifeplayNext },
                { level: state.blocking, current: state.blockingCurrent, next: state.blockingNext },
                { level: state.pugilism, current: state.pugilismCurrent, next: state.pugilismNext },
                { level: state.fireMagic, current: state.fireMagicCurrent, next: state.fireMagicNext },
                { level: state.waterMagic, current: state.waterMagicCurrent, next: state.waterMagicNext },
                { level: state.earthMagic, current: state.earthMagicCurrent, next: state.earthMagicNext },
                { level: state.windMagic, current: state.windMagicCurrent, next: state.windMagicNext },
                { level: state.whiteMagic, current: state.whiteMagicCurrent, next: state.whiteMagicNext },
                { level: state.blackMagic, current: state.blackMagicCurrent, next: state.blackMagicNext },
                { level: state.heavySwords, current: state.heavySwordsCurrent, next: state.heavySwordsNext },
                { level: state.hammerWielding, current: state.hammerWieldingCurrent, next: state.hammerWieldingNext },
                { level: state.bluntWeapons, current: state.bluntWeaponsCurrent, next: state.bluntWeaponsNext },
                { level: state.staffFighting, current: state.staffFightingCurrent, next: state.staffFightingNext },
                { level: state.axeFighting, current: state.axeFightingCurrent, next: state.axeFightingNext },
                { level: state.fencing, current: state.fencingCurrent, next: state.fencingNext },
                { level: state.shortBows, current: state.shortBowsCurrent, next: state.shortBowsNext },
                { level: state.longBows, current: state.longBowsCurrent, next: state.longBowsNext },
                { level: state.crossbows, current: state.crossbowsCurrent, next: state.crossbowsNext },
                { level: state.mining, current: state.miningCurrent, next: state.miningNext },
                { level: state.fishing, current: state.fishingCurrent, next: state.fishingNext },
                { level: state.cooking, current: state.cookingCurrent, next: state.cookingNext },
                { level: state.alchemy, current: state.alchemyCurrent, next: state.alchemyNext },
                { level: state.farming, current: state.farmingCurrent, next: state.farmingNext },
                { level: state.crafting, current: state.craftingCurrent, next: state.craftingNext },
                { level: state.blacksmithing, current: state.blacksmithingCurrent, next: state.blacksmithingNext },
            ];

            updateSkillsPage(playerSkills);
            updateInventoryPage(state.inventory);

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
            var playerSkills = [
                { level: state.swordsmanship, current: state.swordsmanshipCurrent, next: state.swordsmanshipNext },
                { level: state.mysticism, current: state.mysticismCurrent, next: state.mysticismNext },
                { level: state.archery, current: state.archeryCurrent, next: state.archeryNext },
                { level: state.knifeplay, current: state.knifeplayCurrent, next: state.knifeplayNext },
                { level: state.blocking, current: state.blockingCurrent, next: state.blockingNext },
                { level: state.pugilism, current: state.pugilismCurrent, next: state.pugilismNext },
                { level: state.fireMagic, current: state.fireMagicCurrent, next: state.fireMagicNext },
                { level: state.waterMagic, current: state.waterMagicCurrent, next: state.waterMagicNext },
                { level: state.earthMagic, current: state.earthMagicCurrent, next: state.earthMagicNext },
                { level: state.windMagic, current: state.windMagicCurrent, next: state.windMagicNext },
                { level: state.whiteMagic, current: state.whiteMagicCurrent, next: state.whiteMagicNext },
                { level: state.blackMagic, current: state.blackMagicCurrent, next: state.blackMagicNext },
                { level: state.heavySwords, current: state.heavySwordsCurrent, next: state.heavySwordsNext },
                { level: state.hammerWielding, current: state.hammerWieldingCurrent, next: state.hammerWieldingNext },
                { level: state.bluntWeapons, current: state.bluntWeaponsCurrent, next: state.bluntWeaponsNext },
                { level: state.staffFighting, current: state.staffFightingCurrent, next: state.staffFightingNext },
                { level: state.axeFighting, current: state.axeFightingCurrent, next: state.axeFightingNext },
                { level: state.fencing, current: state.fencingCurrent, next: state.fencingNext },
                { level: state.shortBows, current: state.shortBowsCurrent, next: state.shortBowsNext },
                { level: state.longBows, current: state.longBowsCurrent, next: state.longBowsNext },
                { level: state.crossbows, current: state.crossbowsCurrent, next: state.crossbowsNext },
                { level: state.mining, current: state.miningCurrent, next: state.miningNext },
                { level: state.fishing, current: state.fishingCurrent, next: state.fishingNext },
                { level: state.cooking, current: state.cookingCurrent, next: state.cookingNext },
                { level: state.alchemy, current: state.alchemyCurrent, next: state.alchemyNext },
                { level: state.farming, current: state.farmingCurrent, next: state.farmingNext },
                { level: state.crafting, current: state.craftingCurrent, next: state.craftingNext },
                { level: state.blacksmithing, current: state.blacksmithingCurrent, next: state.blacksmithingNext },
            ];

            updateSkillsPage(playerSkills);

            var equipment = {
                head: state.equipHead,
                torso: state.equipTorso,
                right: state.equipRight,
                left: state.equipLeft,
                legs: state.equipLegs,
                extra: state.equipExtra,
            };
            updateInventoryPage(state.inventory, equipment);
            
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
}

updateSkillsPage = function(skills){
    for(var i = 0; i < 28; i++){
        skillsPage.getAt(i + 28).setText(skills[i].level + " (" + skills[i].current + " / " + skills[i].next + ")");
    }
}

updateInventoryPage = function(inventory, equipment){
    for(var i = 0; i < 16; i++){
        var itemName = game.global.itemManager.getItemName(inventory[i].itemId);
        playerInventory[i].sprite.loadTexture(itemName, 0);
        playerInventory[i].sprite.getChildAt(0).setText(inventory[i].amount);
        playerInventory[i].sprite.getChildAt(0).alpha = 0;
        if (itemName != 'NOTHING'){
            playerInventory[i].sprite.getChildAt(0).alpha = 1;
        }
    }

    var headName = game.global.itemManager.getItemName(equipment.head);
    var torsoName = game.global.itemManager.getItemName(equipment.torso);
    var rightName = game.global.itemManager.getItemName(equipment.right);
    var leftName = game.global.itemManager.getItemName(equipment.left);
    var legsName = game.global.itemManager.getItemName(equipment.legs);
    var extraName = game.global.itemManager.getItemName(equipment.extra);

    playerEquipment.head.loadTexture(headName, 0);
    playerEquipment.torso.loadTexture(torsoName, 0);
    playerEquipment.right.loadTexture(rightName, 0);
    playerEquipment.left.loadTexture(leftName, 0);
    playerEquipment.legs.loadTexture(legsName, 0);
    playerEquipment.extra.loadTexture(extraName, 0);
}

managePageButtons = function(index){
    for(var i = 0; i < 4; i++){
        var thisButton = pageButtons.getAt(i + 4);
        thisButton.alpha = 0;
        if(i == index){
            thisButton.alpha = 1;
        }
    }
    
    statsPage.alpha = 0;
    inventoryPage.alpha = 0;
    skillsPage.alpha = 0;
    skillsPage.maskGraphics.input.useHandCursor = false;
    if(index == 0){ statsPage.alpha = 1; }
    else if(index == 1){ inventoryPage.alpha = 1; }
    else if(index == 2){ skillsPage.alpha = 1; skillsPage.maskGraphics.input.useHandCursor = true;}
}

openContextMenu = function(index){
    var inventory = game.global.player.inventory;
    var inventorySprite = playerInventory[index];
    var itemName = game.global.itemManager.getItemName(inventory[index].itemId);
    var itemCanEquip = game.global.itemManager.canEquip(inventory[index].itemId);
    var itemEquipSlot = game.global.itemManager.getEquipSlot(inventory[index].itemId);
    inventoryContext.removeAll();

    if(itemName == 'NOTHING'){
        return;
    }

    inventoryContext.position.y = inventorySprite.sprite.children[0].worldPosition.y;
    inventoryContext.position.x = inventorySprite.sprite.children[0].worldPosition.x - 50;
    console.log(inventorySprite);
    console.log(itemName);
    console.log(itemCanEquip);
    console.log(itemEquipSlot);
    console.log(inventoryContext);

    var useButton = game.make.text( 0, inventoryContext.children.length * 20, "USE   ", {font:"bold 12px Arial", fill:"purple", backgroundColor: "black"});
    useButton.inputEnabled = true;
    useButton.events.onInputDown.add(function(){closeContextMenu()});
    inventoryContext.addChild(useButton);

    if(itemCanEquip){
        var equipButton = null;
        if(itemEquipSlot == 'Arms'){
            equipButton = game.make.text( 0, inventoryContext.children.length * 20, "EQUIP: Right", {font:"bold 12px Arial", fill:"purple", backgroundColor: "black"});
            equipButton.inputEnabled = true;
            equipButton.events.onInputDown.add(function(){ closeContextMenu(); equipItem(index + 1, 'Right'); });
            inventoryContext.addChild(equipButton);
            var otherArmSlot = game.make.text( 0, inventoryContext.children.length * 20, "EQUIP: Left", {font:"bold 12px Arial", fill:"purple", backgroundColor: "black"});
            otherArmSlot.inputEnabled = true;
            otherArmSlot.events.onInputDown.add(function(){ closeContextMenu(); equipItem(index + 1, 'Left'); });
            inventoryContext.addChild(otherArmSlot);
        }
        else{
            equipButton = game.make.text( 0, inventoryContext.children.length * 20, "EQUIP: " + itemEquipSlot, {font:"bold 12px Arial", fill:"purple", backgroundColor: "black"});
            equipButton.inputEnabled = true;
            equipButton.events.onInputDown.add(function(){ closeContextMenu(); equipItem(index + 1, itemEquipSlot); });
            inventoryContext.addChild(equipButton);
        }
    }

    var dropButton = game.make.text( 0, inventoryContext.children.length * 20, "DROP", {font:"bold 12px Arial", fill:"purple", backgroundColor: "black"});
    dropButton.inputEnabled = true;
    dropButton.events.onInputDown.add(function(){closeContextMenu()});
    inventoryContext.addChild(dropButton);

    var cancelButton = game.make.text( 0, inventoryContext.children.length * 20, "CANCEL", {font:"bold 12px Arial", fill:"purple", backgroundColor: "black"});
    cancelButton.inputEnabled = true;
    cancelButton.events.onInputDown.add(function(){closeContextMenu()});
    inventoryContext.addChild(cancelButton);
    
    inventoryContext.alpha = 1;
}

closeContextMenu = function(){
    inventoryContext.alpha = 0;
    inventoryContext.removeAll();
}

equipItem = function(itemSlot, equipSlot){
    game.global.actionQueue.push({action: {type: 'equipItem', payload: itemSlot}, target: equipSlot});
}
