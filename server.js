var fs = require('fs');
var serverActions = require('./serverActions');

var express = require('express')
    , app = express()
    , server = require('http').createServer(app)

// serve static files from the current directory
app.use(express.static(__dirname));

var Eureca = require('eureca.io');


//create an instance of EurecaServer
var eurecaServer = new Eureca.Server({allow:['setId', 'recieveStateFromServer', 'kill', 'disconnect', 'errorAndDisconnect', 'recieveBroadcast', 'removeItem', 'placeItem', 'placeNPC', 'removeNPC', 'showDamage']});

//attach eureca.io to our http server
eurecaServer.attach(server);

var mysql = require('mysql');

var aStar = require('a-star-search');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1VT2yQtVjX",
  database: "FSORemake"
});

class Spell{
    constructor(data){
        this.spellId = data.spellId;
        this.spellName = data.spellName;
        this.spellType = data.spellType;
        this.spellAffinity = data.spellAffinity;
        this.spellTarget = data.spellTarget;
        this.spellPower = data.spellPower;
        this.isBuff = data.isBuff;
        this.effectLength = data.effectLength;
        this.spellCost = data.spellCost;
        this.spellSprite = data.spellSprite;
        this.levelReqArcane = data.levelReqArcane;
        this.levelReqAffinity = data.levelReqAffinity;
    }
}

class WorldItem{
    constructor(data){
        this.locationId = data.locationId;
        this.itemId = data.itemId;
        this.itemName = data.name;
        this.worldX = data.worldX;
        this.worldY = data.worldY;
        this.pos = {x: data.localX, y: data.localY};
        this.amount = data.amount;
        this.respawnable = data.respawnable;
        this.isSpawned = data.isSpawned;
        this.respawnTimer = data.respawnTimer;

        if(this.respawnable && !this.isSpawned){
            setTimeout(() => this.respawn(), this.respawnTimer);
        }
    }

    remove(){
        if(!this.respawnable){
            delete worldMap[this.worldX + '-' + this.worldY].items[this.locationId];
            con.query("DELETE FROM worldItems WHERE locationId = '" + this.locationId + "'", function (err, result, fields) {});
        }
        else{
            //Item is respawnable, need to modify sql table for a isSpawned property and timeToRespawn
            this.isSpawned = false;
            con.query("UPDATE worldItems SET isSpawned = 0 WHERE locationId = '" + this.locationId + "'", function (err, result, fields) {});
            setTimeout(() => this.respawn(), this.respawnTimer);
        }
        for(var i in worldMap[this.worldX + '-' + this.worldY].players) {
            var index = worldMap[this.worldX + '-' + this.worldY].players[i].playerId;
            var visiblePlayer = players[index];
            visiblePlayer.remote.removeItem(this.locationId);
           
        }
    }

    respawn(){
        this.isSpawned = true;
        con.query("UPDATE worldItems SET isSpawned = 1 WHERE locationId = '" + this.locationId + "'", function (err, result, fields) {});
        worldMap[this.worldX + '-' + this.worldY].items[this.locationId] = this;
        for(var i in worldMap[this.worldX + '-' + this.worldY].players) {
            var index = worldMap[this.worldX + '-' + this.worldY].players[i].playerId;
            var visiblePlayer = players[index];
            visiblePlayer.remote.placeItem(this);  
        }
    }

    placeItem(){
        //Register in worldMap
        //Query to place this item into worldItems
        //update players
        for(var i in worldMap[this.worldX + '-' + this.worldY].players) {
            var index = worldMap[this.worldX + '-' + this.worldY].players[i].playerId;
            var visiblePlayer = players[index];
            visiblePlayer.remote.placeItem(this);
           
        }
    }
}

class Item{
    constructor(data){
        this.itemId = data.itemId;
        this.itemName = data.itemName;
        this.canEquip = data.canEquip;
        this.canConsume = data.canConsume;
        this.maxHealthBonus = data.maxHealthBonus;
        this.currentHealthBonus = data.currentHealthBonus;
        this.maxFocusBonus = data.maxFocusBonus;
        this.currentFocusBonus = data.currentFocusBonus;
        this.maxStaminaBonus = data.maxStaminaBonus;
        this.currentStaminaBonus = data.currentStaminaBonus;
        this.strengthBonus = data.strengthBonus;
        this.dexterityBonus = data.dexterityBonus;
        this.enduranceBonus = data.enduranceBonus;
        this.agilityBonus = data.agilityBonus;
        this.arcaneBonus = data.arcaneBonus;
        this.luckBonus = data.luckBonus;
        this.physicalAttack = data.physicalAttack;
        this.physicalDefense = data.physicalDefense;
        this.physicalEvasion = data.physicalEvasion;
        this.magicalAttack = data.magicalAttack;
        this.magicalDefense = data.magicalDefense;
        this.magicalEvasion = data.magicalEvasion;
        this.amount = data.amount;
        this.equipSlot = data.equipSlot;
        this.effectLength = data.effectLength;
        this.itemType = data.itemType;
        this.levelReqStat = data.levelReqStat;
        this.levelReqSkill = data.levelReqSkill;
    }
}


class PlayerState
{
    constructor(idString, data){
        this.pos = {x: data.localX, y: data.localY};
        this.playerFacing = 'S';
        this.playerId = idString;
        this.username = data.username;
        this.gender = data.gender;
        this.headType = data.headType;
        this.class = data.class;
        this.level = data.level;
        this.gold = data.gold;
        this.maxHealth = data.maxHealth;
        this.health = data.health;
        this.maxFocus = data.maxFocus;
        this.focus = data.focus;
        this.stamina = data.stamina;
        this.strength = data.strength;
        this.dexterity = data.dexterity;
        this.endurance = data.endurance;
        this.agility = data.agility;
        this.arcane = data.arcane;
        this.luck = data.luck;
        this.swordsmanship = data.swordsmanship;
        this.mysticism = data.mysticism;
        this.archery = data.archery;
        this.knifeplay = data.knifeplay;
        this.blocking = data.blocking;
        this.pugilism = data.pugilism;
        this.fireMagic = data.fireMagic;
        this.waterMagic = data.waterMagic;
        this.earthMagic = data.earthMagic;
        this.windMagic = data.windMagic;
        this.whiteMagic = data.whiteMagic;
        this.blackMagic = data.blackMagic;
        this.heavySwords = data.heavySwords;
        this.hammerWielding = data.hammerWielding;
        this.bluntWeapons = data.bluntWeapons;
        this.staffFighting = data.staffFighting;
        this.axeFighting = data.axeFighting;
        this.fencing = data.fencing;
        this.shortBows = data.shortBows;
        this.longBows = data.longBows;
        this.crossbows = data.crossbows;
        this.mining = data.mining;
        this.fishing = data.fishing;
        this.cooking = data.cooking;
        this.alchemy = data.alchemy;
        this.farming = data.farming;
        this.crafting = data.crafting;
        this.blacksmithing = data.blacksmithing;

        this.swordsmanshipCurrent = data.swordsmanshipCurrent;
        this.mysticismCurrent = data.mysticismCurrent;
        this.archeryCurrent = data.archeryCurrent;
        this.knifeplayCurrent = data.knifeplayCurrent;
        this.blockingCurrent = data.blockingCurrent;
        this.pugilismCurrent = data.pugilismCurrent;
        this.fireMagicCurrent = data.fireMagicCurrent;
        this.waterMagicCurrent = data.waterMagicCurrent;
        this.earthMagicCurrent = data.earthMagicCurrent;
        this.windMagicCurrent = data.windMagicCurrent;
        this.whiteMagicCurrent = data.whiteMagicCurrent;
        this.blackMagicCurrent = data.blackMagicCurrent;
        this.heavySwordsCurrent = data.heavySwordsCurrent;
        this.hammerWieldingCurrent = data.hammerWieldingCurrent;
        this.bluntWeaponsCurrent = data.bluntWeaponsCurrent;
        this.staffFightingCurrent = data.staffFightingCurrent;
        this.axeFightingCurrent = data.axeFightingCurrent;
        this.fencingCurrent = data.fencingCurrent;
        this.shortBowsCurrent = data.shortBowsCurrent;
        this.longBowsCurrent = data.longBowsCurrent;
        this.crossbowsCurrent = data.crossbowsCurrent;
        this.miningCurrent = data.miningCurrent;
        this.fishingCurrent = data.fishingCurrent;
        this.cookingCurrent = data.cookingCurrent;
        this.alchemyCurrent = data.alchemyCurrent;
        this.farmingCurrent = data.farmingCurrent;
        this.craftingCurrent = data.craftingCurrent;
        this.blacksmithingCurrent = data.blacksmithingCurrent;

        this.swordsmanshipNext = data.swordsmanshipNext;
        this.mysticismNext = data.mysticismNext;
        this.archeryNext = data.archeryNext;
        this.knifeplayNext = data.knifeplayNext;
        this.blockingNext = data.blockingNext;
        this.pugilismNext = data.pugilismNext;
        this.fireMagicNext = data.fireMagicNext;
        this.waterMagicNext = data.waterMagicNext;
        this.earthMagicNext = data.earthMagicNext;
        this.windMagicNext = data.windMagicNext;
        this.whiteMagicNext = data.whiteMagicNext;
        this.blackMagicNext = data.blackMagicNext;
        this.heavySwordsNext = data.heavySwordsNext;
        this.hammerWieldingNext = data.hammerWieldingNext;
        this.bluntWeaponsNext = data.bluntWeaponsNext;
        this.staffFightingNext = data.staffFightingNext;
        this.axeFightingNext = data.axeFightingNext;
        this.fencingNext = data.fencingNext;
        this.shortBowsNext = data.shortBowsNext;
        this.longBowsNext = data.longBowsNext;
        this.crossbowsNext = data.crossbowsNext;
        this.miningNext = data.miningNext;
        this.fishingNext = data.fishingNext;
        this.cookingNext = data.cookingNext;
        this.alchemyNext = data.alchemyNext;
        this.farmingNext = data.farmingNext;
        this.craftingNext = data.craftingNext;
        this.blacksmithingNext = data.blacksmithingNext;

        this.inventory = [
            {itemId: data.slot1, amount: data.slot1Amount}, {itemId: data.slot2, amount: data.slot2Amount}, {itemId: data.slot3, amount: data.slot3Amount}, {itemId: data.slot4, amount: data.slot4Amount},
            {itemId: data.slot5, amount: data.slot5Amount}, {itemId: data.slot6, amount: data.slot6Amount}, {itemId: data.slot7, amount: data.slot7Amount}, {itemId: data.slot8, amount: data.slot8Amount},
            {itemId: data.slot9, amount: data.slot9Amount}, {itemId: data.slot10, amount: data.slot10Amount}, {itemId: data.slot11, amount: data.slot11Amount}, {itemId: data.slot12, amount: data.slot12Amount},
            {itemId: data.slot13, amount: data.slot13Amount}, {itemId: data.slot14, amount: data.slot14Amount}, {itemId: data.slot15, amount: data.slot15Amount}, {itemId: data.slot16, amount: data.slot16Amount},
        ];

        this.spells = {};

        //How many spells are in the game?
        for(var i = 0; i < 1; i++){
            var spellSlot = parseInt(i) + 1;
            if(data['spell' + spellSlot] != 0){
                var thisSpellId = data['spell' + spellSlot];
                this.spells[thisSpellId] = spellData[thisSpellId];
            }
        }

        this.equipHead = data.equipHead;
        this.equipTorso = data.equipTorso;
        this.equipRight = data.equipRight;
        this.equipLeft = data.equipLeft;
        this.equipLegs = data.equipLegs;
        this.equipExtra =  data.equipExtra;
        this.playerAction = 'idle';
        this.worldX = data.worldX;
        this.worldY = data.worldY;
        this.lastUpdated = null;
        this.readyToUpdate = true;
        this.playersVisible = {};
        this.mapData = worldMap[this.worldX + '-' + this.worldY];

        for(var i in this.mapData.npcs){
            var thisNPC = this.mapData.npcs[i];
            if(thisNPC.isActive == false){
                thisNPC.isActive = true;
                activeNPCs[thisNPC.npcId] = thisNPC;
                console.log(thisNPC.npcName + " is now active");
            }
        }
    }
    /* 
    copy(other)
    {
        this.pos = other.pos;
        this.playerFacing = other.playerFacing;
        this.playerId = other.playerId;
        this.playerAction = other.playerAction;
        this.worldX = other.worldX;
        this.worldY = other.worldY;
        this.lastUpdated = other.lastUpdated;
        this.readyToUpdate = other.readyToUpdate;
        this.playersVisible = other.playersVisible;
        this.mapData = other.mapData;
    } */

    changeMapData(worldXNew, worldYNew){
        worldMap[worldXNew + '-' + worldYNew].players[this.playerId] = this;

        //Need to Let other players know this guy left
        delete worldMap[this.worldX + '-' + this.worldY].players[this.playerId];

        for (var c in worldMap[this.worldX + '-' + this.worldY].players){
            var remote = players[c].remote;

            //here we call kill() method defined in the client side
            remote.kill(this.playerId);
        }
        this.mapData = worldMap[worldXNew + '-' + worldYNew];
        this.worldX = worldXNew;
        this.worldY = worldYNew;
        con.query("UPDATE users SET worldX='" + this.worldX + "', worldY='" + this.worldY + "' WHERE username = '" + this.username + "'", function (err, result, fields) {});

        for(var i in this.mapData.npcs){
            var thisNPC = this.mapData.npcs[i];
            if(thisNPC.isActive == false){
                thisNPC.isActive = true;
                activeNPCs[thisNPC.npcId] = thisNPC;
                console.log(thisNPC.npcName + " is now active");
            }
        }
    }

    takeStep(x, y){
        if((x + 1 == this.pos.x || x - 1 == this.pos.x || x == this.pos.x)
            && (y + 1 == this.pos.y || y - 1 == this.pos.y || y == this.pos.y)){

            var visiblePlayers = [];
            for(var i in worldMap[this.worldX + '-' + this.worldY].players){
                if(worldMap[this.worldX + '-' + this.worldY].players[i].playerId != this.playerId){
                    visiblePlayers.push(worldMap[this.worldX + '-' + this.worldY].players[i]);
                }
            }
            for(var i in worldMap[this.worldX + '-' + this.worldY].npcs){
                visiblePlayers.push(worldMap[this.worldX + '-' + this.worldY].npcs[i]);
            }
            var isOpenSpace = true;
            for(var player of visiblePlayers){
                if(player.pos.x == x && player.pos.y == y){
                    isOpenSpace = false;
                }
            }

            if(isOpenSpace){
                con.query("UPDATE users SET localX='" + this.pos.x + "', localY='" + this.pos.y + "' WHERE username = '" + this.username + "'", function (err, result, fields) {});
                return worldMap[this.worldX + '-' + this.worldY].mapData[y][x] == 0; //acceptable tiles
            }
            else{
                return false;
            }
            
            
        }
        return false;
    }

    takeDamage(damage, attackerId, npcOrPlayer){ //attackerId can be null if player is taking damage from not a player
        var damageMitigated = Math.floor((((this.endurance + this.blocking) / 10) * (itemData[this.equipHead].physicalDefense + itemData[this.equipTorso].physicalDefense + itemData[this.equipLegs].physicalDefense)) + Math.floor(Math.random() * Math.floor(3)));
        if(damage - damageMitigated <= 0){
            //0 damage
            for (var c in worldMap[this.worldX + '-' + this.worldY].players){
                var remote = players[c].remote;
                remote.showDamage(0, 'player', this.playerId);
            }
            return
        }
        this.health -= (damage - damageMitigated);
        if(this.health > 0){
            if(this.equipTorso != 1 || this.equipHead != 1 || this.equipLegs != 1){
                if(npcOrPlayer == 'player'){
                    var attackingPlayer = players[attackerId].state;
                    if(attackingPlayer.level - this.level >= 0){
                        this.getExp(attackingPlayer.level - this.level, ['mediumArmor']);
                    }
                }
            }
            for (var c in worldMap[this.worldX + '-' + this.worldY].players){
                var remote = players[c].remote;
                remote.showDamage((damage - damageMitigated), 'player', this.playerId);
            }
            con.query("UPDATE users SET health='" + this.health + "' WHERE username = '" + this.username + "'", function (err, result, fields) {});
        }
        else{
            delete worldMap[this.worldX + '-' + this.worldY].players[this.playerId];
            for (var c in worldMap[this.worldX + '-' + this.worldY].players){
                var remote = players[c].remote;
    
                //here we call kill() method defined in the client side
                remote.kill(this.playerId);
            }
            this.health = 100;
            this.worldX = 0;
            this.worldY = 0;
            this.pos = {x: 1, y: 1};
            this.playerFacing = 'S';
            this.playerAction = 'idle';
            this.mapData = worldMap[this.worldX + '-' + this.worldY].mapData;
            worldMap[this.worldX + '-' + this.worldY].players[this.playerId] = this;
            con.query("UPDATE users SET health='" + this.health + 
                "', worldX='" + this.worldX + 
                "', worldY='" + this.worldY + 
                "', localX='" + this.pos.x + 
                "', localY='" + this.pos.y + 
                "' WHERE username='" + this.username + "'", function (err, result, fields) {if (err) throw err; });
            if(npcOrPlayer == 'player' && attackerId != undefined){
                var winner = players[attackerId].state;
                var exp = this.baseExp + (winner.level - this.level);
                var equipItems = [];
                if(winner.equipRight == 1 && winner.equipLeft == 1){
                    equipItems.push('fists');
                }
                else{
                    equipItems = [itemData[winner.equipRight].itemType, itemData[winner.equipLeft].itemType];
                }
                winner.getExp(exp, equipItems);
                for(var i in players){
                    var player = players[i];
                    player.remote.recieveBroadcast(this.username + " was killed by " + winner.username, '#ffff00');
                }
                
            }
            else if(npcOrPlayer == 'npc' && attackerId != undefined){
                var winner = npcs[attackerId];
                for(var i in players){
                    var player = players[i];
                    player.remote.recieveBroadcast(this.username + " was killed by " + winner.npcName, '#ffff00');
                }
            }
        }
    }

    getExp(expAmount, expTargets){
        var expToGive = expAmount / expTargets.length;
        for(var i = 0; i < expTargets.length; i++){
            var exp = expTargets[i];
            switch(exp){
                case 'knife':{
                    this.knifeplayCurrent += expToGive;
                    if(this.knifeplayCurrent >= this.knifeplayNext){
                        this.knifeplay++;
                        this.knifeplayNext = (this.knifeplay + this.knifeplayNext) * 1.1;
                        players[this.playerId].remote.recieveBroadcast("[LEVEL UP]: " + this.username + "'s knifeplay is now level: " + this.knifeplay, '#ffffff');
                    }
                    else{
                        players[this.playerId].remote.recieveBroadcast('[EXP] You gained ' + expToGive + ' exp in knifeplay!', '#ffffff');
                    }
                    con.query("UPDATE skillLevels SET knifeplayCurrent='" + this.knifeplayCurrent + "', knifeplay='" + this.knifeplay + "', knifeplayNext='" + this.knifeplayNext + "' WHERE username='" + this.username + "'", function (err, result, fields) {if (err) throw err; });
                    break;
                }
                case 'fists':{
                    this.pugilism += expToGive;
                    if(this.pugilismCurrent >= this.pugilismNext){
                        this.pugilism++;
                        this.pugilismNext = (this.pugilism + this.pugilismNext) * 1.1;
                        players[this.playerId].remote.recieveBroadcast("[LEVEL UP]: " + this.username + "'s pugilism is now level: " + this.pugilism, '#ffffff');
                    }
                    else{
                        players[this.playerId].remote.recieveBroadcast('[EXP] You gained ' + expToGive + ' exp in pugilism!', '#ffffff');
                    }
                    con.query("UPDATE skillLevels SET pugilismCurrent='" + this.pugilismCurrent + "', pugilism='" + this.pugilism + "', pugilismNext='" + this.pugilismNext + "' WHERE username='" + this.username + "'", function (err, result, fields) {if (err) throw err; });
                    break;
                }
                case 'mediumArmor':{
                    this.blockingCurrent += expToGive;
                    if(this.blockingCurrent >= this.blockingNext){
                        this.knifeplay++;
                        this.blockingNext = (this.blocking + this.blockingNext) * 1.1;
                        players[this.playerId].remote.recieveBroadcast("[LEVEL UP]: " + this.username + "'s blocking is now level: " + this.blocking, '#ffffff');
                    }
                    else{
                        players[this.playerId].remote.recieveBroadcast('[EXP] You gained ' + expToGive + ' exp in blocking!', '#ffffff');
                    }
                    con.query("UPDATE skillLevels SET blockingCurrent='" + this.blockingCurrent + "', blocking='" + this.blocking + "', blockingNext='" + this.blockingNext + "' WHERE username='" + this.username + "'", function (err, result, fields) {if (err) throw err; });
                    break;
                }
                default:{
                    //nothing
                }
            }
        }
        
    }

    getItem(locationId){
        var thisItem = worldMap[this.worldX + '-' + this.worldY].items[locationId];

        //Stackable logic...
        var shouldStack = false;
        var chosenSlot = null;
        var stackAmount = 0;

        //Find Slot to place item
        for(var i = 0; i < this.inventory.length; i++){
            var item = this.inventory[i];
            var itemSlot = parseInt(i) + 1;
            if (item.itemId == 1){
                //place item here
                if(chosenSlot == null){
                    chosenSlot = itemSlot;
                }
                
            }
            if(item.itemId == thisItem.itemId && item.amount < 99){
                //Already holding that item, and holding less than 99
                shouldStack = true;
                stackAmount = item.amount;
                chosenSlot = itemSlot;
                break;
            }
        }

        if(chosenSlot != null){
            
            this.inventory[chosenSlot - 1].itemId = thisItem.itemId;
            this.inventory[chosenSlot - 1].amount = thisItem.amount;
            thisItem.remove();

            if(shouldStack){
                this.inventory[chosenSlot - 1].amount += stackAmount;
                con.query("UPDATE playerInv SET slot" + chosenSlot + "Amount ='" + this.inventory[chosenSlot-1].amount + "' WHERE username = '" + this.username + "'", function (err, result, fields) {if (err) throw err;});
            }
            else{
                con.query("UPDATE playerInv SET slot" + chosenSlot + "='" + thisItem.itemId + "', slot" + chosenSlot + "Amount ='" + this.inventory[chosenSlot-1].amount + "' WHERE username = '" + this.username + "'", function (err, result, fields) {if (err) throw err;});
            }
        }
    }

    dropItem(slotNumber){
        //What item is in that slot?
        var inventorySlotId = this.inventory[slotNumber - 1].itemId;
        var inventorySlotName = itemData[inventorySlotId].itemName;

        //How many of that item are in that slot?
        var inventorySlotAmount = this.inventory[slotNumber - 1].amount;

        //Is there an item underneath the player already?
        var isItemUnderneath = false;
        var shouldStackItem = false;
        var stackAmount = 0;
        var itemUnderneath = null;
        
        for( var i in this.mapData.items){
            var item = this.mapData.items[i];
            if(item.pos.x == this.pos.x && item.pos.y == this.pos.y){
                itemUnderneath = item;
                break;
            }
        }

        //New WorldItem;
        var newWorldItem = new WorldItem({
            locationId: ++locationIdMaxIndex,
            itemId: inventorySlotId,
            name: inventorySlotName,
            worldX: this.worldX,
            worldY: this.worldY,
            localX: this.pos.x,
            localY: this.pos.y,
            amount: 1,
            respawnable: false,
            isSpawned: true,
            respawnTimer: null
        });
        
        //If so, is that item the same thing as the item trying to be dropped?
        if(itemUnderneath != null){
            isItemUnderneath = true;
            if(itemUnderneath.itemId == inventorySlotId){
                shouldStackItem = true;
                stackAmount = itemUnderneath.amount;
            }
        }

        //Is the player holding more than one of that item?
        var shouldRemoveItem = false;
        if(inventorySlotAmount == 1){
            shouldRemoveItem = true;
        }

        //Query for if the player is only holding one AND there is no item underneath the player
            //remove from inventory and just place it
        if(shouldRemoveItem == true && shouldStackItem == false && isItemUnderneath == false){
            this.inventory[slotNumber - 1].itemId = 1;
            this.inventory[slotNumber - 1].amount = 1;
            worldMap[this.worldX + '-' + this.worldY].items[newWorldItem.locationId] = newWorldItem;
            newWorldItem.placeItem();
            console.log("Remove and drop");
            //Place item
            con.query("INSERT INTO worldItems(locationId, itemId, name, amount, worldX, worldY, localX, localY, respawnable, isSpawned, respawnTimer) VALUES(" +
                "'" + newWorldItem.locationId + "', " +
                "'" + newWorldItem.itemId + "', " +
                "'" + newWorldItem.itemName + "', " +
                "'" + newWorldItem.amount + "', " +
                "'" + newWorldItem.worldX + "', " +
                "'" + newWorldItem.worldY + "', " +
                "'" + newWorldItem.pos.x + "', " +
                "'" + newWorldItem.pos.y + "', " +
                newWorldItem.respawnable + ", " +
                newWorldItem.isSpawned + ", " +
                "'" + newWorldItem.respawnTimer + "'"
            + ")", function (err, result, fields) {
                if (err) throw err;
                //remove from inventory
                con.query("UPDATE playerInv SET slot" + slotNumber + "=1 WHERE username = '" + this.username + "'", function (err, result, fields){if (err) throw err;});
            });
            
        }

        //Query for if the player is only holding one AND there is an item underneath the player AND that item IS NOT the same as the item being dropped
            //Cant do That
        if(shouldRemoveItem == true && shouldStackItem == false && isItemUnderneath == true){
            newWorldItem = null;
            console.log("Cant do that");
            players[this.playerId].remote.recieveBroadcast("You think: I cannot drop this here...", '#ffffff');
        }

        //Query for if the player is only holding one AND there is an item underneath the player AND that item IS the same as the item being dropped
            //remove from inventory and Increase the Amount of that item on the ground
        if(shouldRemoveItem == true && shouldStackItem == true && isItemUnderneath == true){
            this.inventory[slotNumber - 1].itemId = 1;
            this.inventory[slotNumber - 1].amount = 1;
            worldMap[this.worldX + '-' + this.worldY].items[itemUnderneath.locationId].amount += 1;
            console.log("remove and increase");
            con.query("UPDATE worldItems SET amount=" +
                "'" + worldMap[this.worldX + '-' + this.worldY].items[itemUnderneath.locationId].amount + 
                "' WHERE locationId='" + itemUnderneath.locationId + "'", function (err, result, fields) {
                    if (err) throw err;
                    //remove from inventory
                    con.query("UPDATE playerInv SET slot" + slotNumber + "=1 WHERE username = '" + this.username + "'", function (err, result, fields){if (err) throw err;});
            });
        }

        //Query for if the player is holding more than one AND there is no item underneath the player
            //decrement from inventory and Just place it
        if(shouldRemoveItem == false && shouldStackItem == false && isItemUnderneath == false){
            this.inventory[slotNumber - 1].amount = inventorySlotAmount - 1;
            worldMap[this.worldX + '-' + this.worldY].items[newWorldItem.locationId] = newWorldItem;
            var inventoryAmount = this.inventory[slotNumber - 1].amount;
            newWorldItem.placeItem();
            console.log("decrease and drop");
            //Place item
            con.query("INSERT INTO worldItems(locationId, itemId, name, amount, worldX, worldY, localX, localY, respawnable, isSpawned, respawnTimer) VALUES(" +
                "'" + newWorldItem.locationId + "', " +
                "'" + newWorldItem.itemId + "', " +
                "'" + newWorldItem.itemName + "', " +
                "'" + newWorldItem.amount + "', " +
                "'" + newWorldItem.worldX + "', " +
                "'" + newWorldItem.worldY + "', " +
                "'" + newWorldItem.pos.x + "', " +
                "'" + newWorldItem.pos.y + "', " +
                newWorldItem.respawnable + ", " +
                newWorldItem.isSpawned + ", " +
                "'" + newWorldItem.respawnTimer + "'"
            + ")", function (err, result, fields) {
                if (err) throw err;
                //remove from inventory
                con.query("UPDATE playerInv SET slot" + slotNumber + "Amount=" + inventoryAmount + " WHERE username = '" + this.username + "'", function (err, result, fields){if (err) throw err;});
            });
        }

        //Query for if the player is holding more than one AND there is an item underneath the player AND that item IS NOT the same as the item being dropped
            //Can't do that
        if(shouldRemoveItem == false && shouldStackItem == false && isItemUnderneath == true){
            newWorldItem = null;
            console.log("Cant do that");
            players[this.playerId].remote.recieveBroadcast("You think: I cannot drop this here...", '#ffffff');
        }

        //Query for if the player is holding more than one AND there is an item underneath the player AND that item IS the same as the item being dropped
            //Decrement from inventory and Increase the Amount of that item on the ground
        if(shouldRemoveItem == false && shouldStackItem == true && isItemUnderneath == true){
            this.inventory[slotNumber - 1].amount -= 1;
            var inventoryAmount = this.inventory[slotNumber - 1].amount;
            worldMap[this.worldX + '-' + this.worldY].items[itemUnderneath.locationId].amount += 1;
            console.log("decrease and increase");
            con.query("UPDATE worldItems SET amount=" +
                + worldMap[this.worldX + '-' + this.worldY].items[itemUnderneath.locationId].amount + 
                " WHERE locationId='" + itemUnderneath.locationId + "'", function (err, result, fields) {
                    if (err) throw err;
                    //remove from inventory
                    con.query("UPDATE playerInv SET slot" + slotNumber + "Amount=" + inventoryAmount + " WHERE username = '" + this.username + "'", function (err, result, fields){if (err) throw err;});
            });
        }
    }

    equipQuery(queryString){
        console.log(queryString);
        var worldMapString = this.worldX + "-" + this.worldY;
        var playerId = this.playerId;
        var myState = this;
        con.query(queryString, function (err, result, fields) {if (err) throw err; worldMap[worldMapString].players[playerId] = myState});
    }

    unequipQuery(queryString){
        console.log(queryString);
        var worldMapString = this.worldX + "-" + this.worldY;
        var playerId = this.playerId;
        var myState = this;
        con.query(queryString, function (err, result, fields) {if (err) throw err; worldMap[worldMapString].players[playerId] = myState});
    }
};

class NPC{
    constructor(data){
        this.npcId = data.npcId;
        this.npcName = data.npcName;
        this.worldX = data.worldX;
        this.worldY = data.worldY;
        this.pos = {x: data.localX, y: data.localY};
        this.spawnLoc = {x: data.localX, y: data.localY};
        this.level = data.level;
        this.class = data.class;
        this.aggroRange = data.aggroRange;
        this.isPassive = data.isPassive;
        this.baseExp = data.baseExp;
        this.isSpawned = data.isSpawned;
        this.respawnable = data.respawnable;
        this.respawnTimer = data.respawnTimer;
        this.faction = data.faction;
        this.doesRoam = data.doesRoam;
        this.npcAction = 'idle';
        this.npcFacing = 'S';
        this.target = null;
        this.isHuman = data.isHuman;
        this.maxHealth = data.maxHealth;
        this.health = data.health;
        this.maxFocus = data.maxFocus;
        this.focus = data.focus;
        this.maxStamina = data.maxStamina;
        this.stamina = data.stamina;
        this.strength = data.strength;
        this.dexterity = data.dexterity;
        this.endurance = data.endurance;
        this.agility = data.agility;
        this.arcane = data.arcane;
        this.luck = data.luck;
        this.physicalAttack = data.physicalAttack;
        this.physicalDefense = data.physicalDefense;
        this.physicalEvasion = data.physicalEvasion;
        this.magicalAttack = data.magicalAttack;
        this.magicalDefense = data.magicalDefense;
        this.magicalEvasion = data.magicalEvasion;
        this.gender = data.gender;
        this.headType = data.headType;
        this.equipHead = data.equipHead;
        this.equipTorso = data.equipTorso;
        this.equipRight = data.equipRight;
        this.equipLeft = data.equipLeft;
        this.inventory = [
            {itemId: data.slot1, dropRate: data.slot1DropRate}, {itemId: data.slot2, dropRate: data.slot2DropRate},
            {itemId: data.slot3, dropRate: data.slot3DropRate}, {itemId: data.slot4, dropRate: data.slot4DropRate},
            {itemId: data.slot5, dropRate: data.slot5DropRate}, {itemId: data.slot6, dropRate: data.slot6DropRate}
        ];

        this.spells = {};

        this.isActive = false; //Set to true when a player is on the same map
        
        for(var i = 0; i < 5; i++){
            var spellSlot = parseInt(i) + 1;
            if(data['spell' + spellSlot] != 0){
                var thisSpellId = data['spell' + spellSlot];
                this.spells[thisSpellId] = spellData[thisSpellId];
            }
        }

        if(this.respawnable && !this.isSpawned){
            setTimeout(() => this.respawn(), this.respawnTimer);
        }
    }

    respawn(){
        this.isSpawned = true;
        this.pos = this.spawnLoc;
        this.target = null;
        this.isActive = false;
        this.health = this.maxHealth;
        con.query("UPDATE npcs SET isSpawned = 1 WHERE npcId = '" + this.npcId + "'", function (err, result, fields) {});
        worldMap[this.worldX + '-' + this.worldY].npcs[this.npcId] = this;
        for(var i in worldMap[this.worldX + '-' + this.worldY].players) {
            var index = worldMap[this.worldX + '-' + this.worldY].players[i].playerId;
            var visiblePlayer = players[index];

            if(this.isActive == false){
                this.isActive = true;
                activeNPCs[this.npcId] = this;
                console.log(this.npcName + " is now active");
            }
            visiblePlayer.remote.placeNPC(this); 
        }
    }

    decideAction(){
        var shouldStayActive = false;
        var visiblePlayers = [];
        for(var i in worldMap[this.worldX + '-' + this.worldY].players){
            visiblePlayers.push(worldMap[this.worldX + '-' + this.worldY].players[i]);
            if(shouldStayActive == false){
                shouldStayActive = true;
            }
        }

        if(!shouldStayActive){
            this.isActive = false;
            delete activeNPCs[this.npcId];
            console.log(this.npcName + " is now inactive");
            return;
        }
        else{
            var randomTimeout = Math.floor(Math.random() * Math.floor(1000));
            
            var randomTimeout = Math.floor(Math.random() * Math.floor(1000));
            var willWander = false;
            var willAttack = false;
            var willFollow = false;
            var targetPos = {x: null, y: null};
            var nextPos = {x: null, y: null};
            
            //If isPassive == false,
            if(!this.isPassive){

                //if target == null, try to find a target within the AggroRange
                if(this.target == null){
                    var minX = this.pos.x - this.aggroRange;
                    var minY = this.pos.y - this.aggroRange;
                    var maxX = this.pos.x + this.aggroRange;
                    var maxY = this.pos.y + this.aggroRange;

                    for(var i in worldMap[this.worldX + '-' + this.worldY].players){
                        var thisPlayer = worldMap[this.worldX + '-' + this.worldY].players[i];
                        if(this.target == null && thisPlayer.pos.x >= minX && thisPlayer.pos.x <= maxX && thisPlayer.pos.y >= minY && thisPlayer.pos.x){
                            //Player is within range
                            this.target = thisPlayer.playerId;
                            targetPos = thisPlayer.pos;
                        }
                    }

                }
                else{
                    //update targetPos
                    if(worldMap[this.worldX + '-' + this.worldY].players[this.target] != undefined){
                        targetPos = worldMap[this.worldX + '-' + this.worldY].players[this.target].pos;
                    }
                    else{
                        this.target = null;
                    }
                }
            }


            //if no target exists, just wander around
            if(this.target == null){
                willWander = true;
            }
            else{
                //if target != null
                if(((this.pos.x + 1 == targetPos.x || this.pos.x - 1 == targetPos.x) && this.pos.y == targetPos.y)
                    || ((this.pos.y + 1 == targetPos.y || this.pos.y - 1 == targetPos.y) && this.pos.x == targetPos.x)){
                    //if next to the target: ATTACK
                    willAttack = true;
                    this.npcAction = 'attack';
                    if(this.pos.x < targetPos.x){
                        this.npcFacing = 'E'
                    }
                    else if(this.pos.x > targetPos.x){
                        this.npcFacing = 'W'
                    }
                    else if(this.pos.y < targetPos.y){
                        this.npcFacing = 'S'
                    }
                    else if(this.pos.y > targetPos.y){
                        this.npcFacing = 'N'
                    }
                    var damage = Math.floor(((this.strength / 10) * this.physicalAttack) + Math.floor(Math.random() * Math.floor(6)));
                    players[this.target].state.takeDamage(damage, this.npcId, 'npc');
                }
                else{
                    //else try to find a path to the target, or cast spell
                    willFollow = true;
                    var path = aStar.run({xAxis: this.pos.x, yAxis: this.pos.y}, {xAxis: targetPos.x, yAxis: targetPos.y}, worldGrid[this.worldX + '-' + this.worldY]);
                    if(path != undefined && path != null){
                        if(this.pos.x < path[1].xAxis){
                            this.npcFacing = 'E'
                        }
                        else if(this.pos.x > path[1].xAxis){
                            this.npcFacing = 'W'
                        }
                        else if(this.pos.y < path[1].yAxis){
                            this.npcFacing = 'S'
                        }
                        else if(this.pos.y > path[1].yAxis){
                            this.npcFacing = 'N'
                        }
                        this.pos.x = path[1].xAxis;
                        this.pos.y = path[1].yAxis;
                        this.npcAction = 'idle';
                    }
                    else{
                        //if no path exists, set target to null and just wander
                        willFollow = false;
                        willWander = true;
                        this.target = null;
                    }
                }
            }
                        
            //else if path does exsit, move toward the target
            if(willWander){
                setTimeout(() => {
                    //just make them wander around for now
                    //this.npcAction = 'idle';
                    var directionToMove = Math.floor(Math.random() * Math.floor(5)); //if 4, we just idle on this cycle
                    if(directionToMove == 0){ //East
                        var nextX = this.pos.x + 1;
                        var nextY = this.pos.y;
                        if(nextX < 16){
                            var nextTile = worldMap[this.worldX + "-" + this.worldY].mapData[nextY][nextX];
                            var isOpenSpace = true;
                            for(var player of visiblePlayers){
                                if(player.pos.x == nextX && player.pos.y == nextY){
                                    isOpenSpace = false;
                                }
                            }
                            if(nextTile == 0 && isOpenSpace){ //acceptableTiles
                                this.pos.x = nextX;
                                this.pos.y = nextY;
                                //this.npcAction = 'walk';
                                this.npcFacing = 'E';
                                visiblePlayers.forEach((player) => {
                                    if(players[player.playerId].state.mapData != undefined){
                                        players[player.playerId].state.mapData.npcs[this.npcId] = this;
                                    }
                                });
                            }
                        }  
                    }
                    if(directionToMove == 1){ //West
                        var nextX = this.pos.x - 1;
                        var nextY = this.pos.y;
                        if(nextX > 0){
                            var nextTile = worldMap[this.worldX + "-" + this.worldY].mapData[nextY][nextX];
                            var isOpenSpace = true;
                            for(var player of visiblePlayers){
                                if(player.pos.x == nextX && player.pos.y == nextY){
                                    isOpenSpace = false;
                                }
                            }
                            if(nextTile == 0 && isOpenSpace){ //acceptableTiles
                                this.pos.x = nextX;
                                this.pos.y = nextY;
                                //this.npcAction = 'walk';
                                this.npcFacing = 'W';
                                visiblePlayers.forEach((player) => {
                                    if(players[player.playerId].state.mapData != undefined){
                                        players[player.playerId].state.mapData.npcs[this.npcId] = this;
                                    }
                                });
                            }
                        }  
                    }
                    if(directionToMove == 2){ //North
                        var nextX = this.pos.x;
                        var nextY = this.pos.y - 1;
                        if(nextY > 0){
                            var nextTile = worldMap[this.worldX + "-" + this.worldY].mapData[nextY][nextX];
                            var isOpenSpace = true;
                            for(var player of visiblePlayers){
                                if(player.pos.x == nextX && player.pos.y == nextY){
                                    isOpenSpace = false;
                                }
                            }
                            if(nextTile == 0 && isOpenSpace){ //acceptableTiles
                                this.pos.x = nextX;
                                this.pos.y = nextY;
                                //this.npcAction = 'walk';
                                this.npcFacing = 'N';
                                visiblePlayers.forEach((player) => {
                                    if(players[player.playerId].state.mapData != undefined){
                                        players[player.playerId].state.mapData.npcs[this.npcId] = this;
                                    }
                                });
                            }
                        }  
                    }
                    if(directionToMove == 3){ //South
                        var nextX = this.pos.x;
                        var nextY = this.pos.y + 1;
                        if(nextY < 11){
                            var nextTile = worldMap[this.worldX + "-" + this.worldY].mapData[nextY][nextX];
                            var isOpenSpace = true;
                            for(var player of visiblePlayers){
                                if(player.pos.x == nextX && player.pos.y == nextY){
                                    isOpenSpace = false;
                                }
                            }
                            if(nextTile == 0 && isOpenSpace){ //acceptableTiles
                                this.pos.x = nextX;
                                this.pos.y = nextY;
                                //this.npcAction = 'walk';
                                this.npcFacing = 'S';
                                visiblePlayers.forEach((player) => {
                                    if(players[player.playerId].state.mapData != undefined){
                                        players[player.playerId].state.mapData.npcs[this.npcId] = this;
                                    }
                                });
                            }
                        }  
                    }
                }, randomTimeout);
            }
            
        }
    }

    takeDamage(damage, attackerId){ //attackerId can be null if player is taking damage from not a player
        var damageMitigated = Math.floor(((this.endurance / 10) * this.physicalDefense) + Math.floor(Math.random() * Math.floor(3)));
        if(damage - damageMitigated <= 0){
            //0 damage
            for (var c in worldMap[this.worldX + '-' + this.worldY].players){
                var remote = players[c].remote;
                remote.showDamage(0, 'npc', this.npcId);
            }
            return
        }
        this.health -= (damage - damageMitigated);
        if(this.health > 0){
            if(this.target == null){
                this.target = attackerId;
            }
            for (var c in worldMap[this.worldX + '-' + this.worldY].players){
                var remote = players[c].remote;
                remote.showDamage((damage - damageMitigated), 'npc', this.npcId);
            }
        }
        else{
            delete worldMap[this.worldX + '-' + this.worldY].npcs[this.npcId];
            this.isActive = false;
            delete activeNPCs[this.npcId];
            console.log(this.npcName + " is now inactive");
            this.isSpawned = false;
            for (var c in worldMap[this.worldX + '-' + this.worldY].players){
                var remote = players[c].remote;
    
                //here we call kill() method defined in the client side
                remote.removeNPC(this.npcId)
            }
            con.query("UPDATE npcs SET isSpawned = 0 WHERE npcId = '" + this.npcId + "'", function (err, result, fields) {});
            
            if(attackerId != undefined){
                var winner = players[attackerId].state;
                var exp = this.baseExp + (winner.level - this.level);
                var equipItems = [];
                if(winner.equipRight == 1 && winner.equipLeft == 1){
                    equipItems.push('fists');
                }
                else{
                    equipItems = [itemData[winner.equipRight].itemType, itemData[winner.equipLeft].itemType];
                }
                winner.getExp(exp, equipItems);
            }
            if(this.respawnable){
                setTimeout(() => this.respawn(), this.respawnTimer);
            }
        }
    }
}

 

var players = {};
var npcs = {};
var activeNPCs = {};
var manageNPCInterval = null;
var worldMap = {};
var worldGrid = {};
var worldItems = [];
var itemData = {};
var spellData = {};
var locationIdMaxIndex = 0;

//detect client connection
eurecaServer.onConnect(function (conn) {
    console.log('New Client id=%s ', conn.id, conn.remoteAddress);

    //the getClient method provide a proxy allowing us to call remote client functions
    var remote = eurecaServer.getClient(conn.id);

    //register the client
    players[conn.id] = {id:conn.id, remote:remote, state: null}
});

//detect client disconnection
eurecaServer.onDisconnect(function (conn) {
    console.log('Client disconnected ', conn.id);
    if(players[conn.id].state){
        for (var c in players)
        {
            var remote = players[c].remote;
    
            //here we call kill() method defined in the client side
            remote.kill(conn.id);
        }
        delete worldMap[players[conn.id].state.worldX + '-' + players[conn.id].state.worldY].players[conn.id];
    }

    delete players[conn.id];
});

app.get('/', function (req, res, next) {
    res.sendFile(__dirname+'/index.html');
});

server.listen(process.env.PORT || 55555, function () {
    console.log('\033[96mlistening on localhost:55555 \033[39m');
    con.connect(function(err) {
        if (err) throw err;
        console.log("Database Connection Established");
        con.query("SELECT * FROM worldItems", function (err, result, fields){
            if (err) throw err;

            worldItems = result;
            console.log("World Items loaded");

            con.query("SELECT * FROM npcs", function (err, result, fields){
                if (err) throw err;
    
                for(var npc of result){
                    npcs[npc.npcId] = new NPC(npc);
                }
                console.log("NPCs loaded");
                loadMapData();
            });
        });

        con.query("SELECT * FROM itemData", function (err, result, fields){
            if (err) throw err;

            for(var item of result){
                itemData[item.itemId] = new Item(item);
            }
            console.log("Item Data loaded");
        });

        con.query("SELECT * FROM spellData", function (err, result, fields){
            if (err) throw err;

            for(var spell of result){
                spellData[spell.spellId] = new Spell(spell);
            }
            console.log("Spell Data loaded");
        });
    });
});

eurecaServer.exports.login = function (username, password){
    var id = this.connection.id;
    var remote = players[id].remote;
    con.query("SELECT * FROM users INNER JOIN skillLevels ON users.username = skillLevels.username INNER JOIN playerInv on users.username = playerInv.username INNER JOIN playerSpells on users.username = playerSpells.username WHERE users.username = '" + username + "'", function (err, result, fields) {
        if (err){ 
            throw err;
            remote.errorAndDisconnect('An unexpected error occured.');
            return;
        }
        
        if(result[0] && result[0].password == password){
            console.log(username + " has logged in");
            players[id].state = new PlayerState(id, result[0]);
            worldMap[players[id].state.worldX + '-' + players[id].state.worldY].players[id] = players[id].state;
            remote.setId(id, itemData);
        }
        else{
            remote.errorAndDisconnect('Wrong username or password!');
        }
    });
}

eurecaServer.exports.createPlayer = function (username, password, params){
    var id = this.connection.id;
    var remote = players[id].remote;
    var regexUsername = new RegExp('^[a-zA-z][a-zA-Z0-9]{2,16}$'); //Only letters, numbers, or spaces, between 2 and 16 chars
    var regexPassword = new RegExp('^(?=.*[a-zA-Z0-9])(?=.*([-+_!@#$%^&*.,?])).{6,16}$'); //Numbers or letters with atleast 1 symbol between 6 and 16 characters
    var totalPointsUsed = params.strength + params.dexterity + params.endurance + params.agility + params.arcane + params.luck;

    if(totalPointsUsed > 56 || totalPointsUsed < 6){
        remote.errorAndDisconnect('Hacking Detected. Do not do that.');
        return;
    }
    if(!regexUsername.test(username)){
        remote.errorAndDisconnect('The username you have chosen contains invalid characters!');
        return;
    }
    if(!regexPassword.test(password)){
        remote.errorAndDisconnect('The password you choose must container between 6-16 letters OR numbers, and at least 1 symbol.');
        return;
    }

    con.query("SELECT * FROM users WHERE username = '" + username + "'", function (err, result, fields) {
        if (err){ 
            throw err;
            remote.errorAndDisconnect('An unexpected error occured.');
            return;
        }

        if(result.length == 0){

            if(params.class == 'warrior'){
                params.strength += 5;
            }
            else if(params.class == 'archer'){
                params.dexterity += 5;
            }
            else{
                params.arcane += 5;
            }

            con.query("INSERT INTO users(username, password, gender, headType, class, worldX, worldY, localX, localY, level, gold, maxHealth, health, maxFocus, focus, stamina, strength, dexterity, endurance, agility, arcane, luck) VALUES ('" 
                + username + "', '" + password + "', '" + params.gender + "', '" + params.headType + "', '" + params.class + "', 0, 0, 1, 1, 1, 0, 100, 100, 25, 25, 100, '" + params.strength + "', '" + params.dexterity + "', '" + params.endurance + "', '" + params.agility + "', '" + params.arcane + "', '" + params.luck + "')", function (err, result, fields) {

                if (err){ 
                    throw err;
                    remote.errorAndDisconnect('An unexpected error occured.');
                    return;
                }

                console.log("New Player Created: " + username);
                //con.query("INSERT INTO skillLevels(username) VALUES('" + username + "')", function (err, result, fields) {if (err) throw err; });

                //con.query("SELECT * FROM users WHERE username = '" + username + "'", function (err, result, fields) 
                con.query("SELECT * FROM users INNER JOIN skillLevels ON users.username = skillLevels.username INNER JOIN playerInv on users.username = playerInv.username INNER JOIN playerSpells on users.username = playerSpells.username WHERE users.username = '" + username + "'", function (err, result, fields) {
                    if (err){ 
                        throw err;
                        remote.errorAndDisconnect('An unexpected error occured.');
                        return;
                    }

                    if(result[0]){
                        players[id].state = new PlayerState(id, result[0]);
                        worldMap[players[id].state.worldX + '-' + players[id].state.worldY].players[id] = players[id].state;
                        remote.setId(id);
                    }
                });
            });
        }
        else{
            remote.errorAndDisconnect('This username is already taken! Please choose another and try again.');
        }
    });

    
}

/**
* Player logs itself into the array of players (handshake still needs to be called
* to do the update. That's done on the client right after).
*/
eurecaServer.exports.initPlayer = function (id) {

    var currentTime = new Date().getTime()

    players[id].state.readyToUpdate = true;
    players[id].state.lastUpdated = currentTime;
    worldMap[players[id].state.worldX + '-' + players[id].state.worldY].players[id] = players[id].state;
    eurecaServer.updateClients(id);

}

//Recieved state update request from a client
eurecaServer.exports.requestUpdate = function (id) {

    var currentServerTime = new Date().getTime();
    if(players[id] && players[id].state.lastUpdated + 250 < currentServerTime){
        players[id].state.lastUpdated = currentServerTime;
        
        eurecaServer.updateClients(id);
    } 
}

eurecaServer.exports.message = function(id, message){
    //message represents the action, id is the sender of that action
    //  message will contain info about what action to perform
    //  as well as the target of the action, whether that be
    //  self, another pc, an npc/enemy, or all users
    //  message structure: message = {
    //      action: {
    //          type //move, attack, localBroadcast, globalBroadcast, whisper, etc...
    //          payload //direction for move, what they're saying, etc...
    //      },
    //      target: //None, Self, OtherPC, NPC, ALL, Object, Visible
    //  }
    if(message == null || message == undefined ||
        message.action == null || message.action == undefined ||
        message.action.type == null || message.action.type == undefined ||
        message.action.payload == null || message.action.payload == undefined ||
        message.target == null || message.target == undefined){
        console.log("ERROR: Recieved invalid message");
        return;
    }

    //Give some thought to still implementing something
    //  to stop players from updating too quickly
    
    switch(message.action.type){
        case 'move': {
            serverActions.movePlayer(players[id].state, message.action.payload);
            break;
        }
        case 'attack': {
            serverActions.playerAttack(players, itemData, id, message.action.payload, message.target);
            break;
        }
        case 'broadcast': {
            serverActions.broadcastMessage(players, id, message.action.payload, message.target);
            break;
        }
        case 'pickup': {
            serverActions.pickUpItem(players[id].state);
            break;
        }
        case 'equipItem': {
            serverActions.equipItem(players[id].state, message, itemData);
            break;
        }
        case 'unequipItem': {
            serverActions.unequipItem(players[id].state, message.target);
            break;
        }
        case 'dropItem': {
            players[id].state.dropItem(message.target);
            break;
        }
        default: {
            console.log("ERROR: Recieved invalid message");
            console.log(message);
            return;
        }
    }
}

//Update player about all players, and all players about player
eurecaServer.updateClients = function (id) {
    var newRemote = players[id].remote;
    var allPlayerStates = [];
    var origWorldMap = Object.assign({}, worldMap[players[id].state.worldX + '-' + players[id].state.worldY]);

    players[id].state.playersVisible = Object.filter(worldMap[players[id].state.worldX + '-' + players[id].state.worldY].players, player => player.playerId != id);
    players[id].state.mapData.players = players[id].state.playersVisible;
    players[id].state.readyToUpdate = true;

    newRemote.recieveStateFromServer(players[id].state);
    
    for(var i in players[id].state.playersVisible) {
        var index = players[id].state.playersVisible[i].playerId;
        var visiblePlayer = players[index];
        if(visiblePlayer.id != id){
            var remote = visiblePlayer.remote;

            visiblePlayer.state.playersVisible = Object.filter(worldMap[visiblePlayer.state.worldX + '-' + visiblePlayer.state.worldY].players, player => player.playerId != visiblePlayer.id);
            visiblePlayer.state.mapData.players = visiblePlayer.state.playersVisible;
            remote.recieveStateFromServer(visiblePlayer.state);
        }
       
    }
    worldMap[players[id].state.worldX + '-' + players[id].state.worldY] = Object.assign({}, origWorldMap);
}

loadMapData = function(){
    console.log('Generating World Map...');
    var totalFiles = -1;
    var filesRead = 0;
    fs.readdir(__dirname + '/maps/', function(err, filenames){
        if (err) {
            console.log(err);
            return;
        }
        totalFiles = filenames.length;
        filenames.forEach(function(filename) {

            fs.readFile(__dirname + '/maps/' + filename, 'utf-8', function(err, content) {
                if (err) {
                    console.log(err);
                    return;
                }

                mapName = filename.substring(0, filename.lastIndexOf("."));

                worldMap[mapName] = {
                    mapData: {},
                    players: {},
                    npcs: {},
                    items: {},
                };

                worldGrid[mapName] = {blockedLocations: [], worldSize: {xAxis: 17, yAxis: 12}};

                var index = 0;

                for (var x = 0; x < 12; x++){
                    worldMap[mapName].mapData[x] = {};
                    for (var y = 0; y < 17; y++) {
                        if(content[index] == '\n' || content[index] == ';'){
                            y--;
                        }
                        else if(content[index] != '\n' && content[index] != ';'){
                            worldMap[mapName].mapData[x][y] = content[index];
                            if(content[index] == 1){ //blocked tiles
                                worldGrid[mapName].blockedLocations.push({xAxis: y, yAxis: x});
                            }
                        }
                        index++;
                    }
                }

                worldItems.forEach((item) => {
                    if(mapName == (item.worldX + "-" + item.worldY)){
                        worldMap[mapName].items[item.locationId] = new WorldItem(item);
                        if (locationIdMaxIndex < item.locationId){
                            locationIdMaxIndex = item.locationId; //Need the highest index so that we can properly create new worldItems for when players drop items
                        }
                    }
                });

                for(var i in npcs) {
                    var npc = npcs[i];
                    if(mapName == (npc.worldX + "-" + npc.worldY)){
                        worldMap[mapName].npcs[npc.npcId] = npc;
                        /* if (locationIdMaxIndex < item.locationId){
                            locationIdMaxIndex = item.locationId; //Need the highest index so that we can properly create new worldItems for when players drop items
                        } */
                    }
                }
                filesRead++;
                
                if(filesRead != 0 && filesRead == totalFiles){
                    console.log("World Map Generated");

                    manageNPCInterval = setInterval(() => manageActiveNPCs(), 3500)
                }
            });
        });
    });
}

manageActiveNPCs = function (){
    for(var i in activeNPCs){
        var thisNPC = activeNPCs[i];
        thisNPC.decideAction();
    }
}

Object.filter = (obj, predicate) => 
    Object.keys(obj)
        .filter( key => predicate(obj[key]) )
        .reduce(function(res, key){
            props = Object.keys(obj[key])
                .filter(prop => prop != 'playersVisible' && prop != 'mapData')
            objCopy = {};
            for(var i in props){
                objCopy[props[i]] = obj[key][props[i]];
            }
            res[key] = objCopy;
            return res;
        }, {});