
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
        //this.level = data.level;
        this.gold = data.gold;
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

        //Level = average of all combat related skills
        this.level = Math.floor((this.swordsmanship + this.mysticism + this.archery + this.knifeplay + this.blocking + this.pugilism + this.fireMagic + this.waterMagic
                        + this.earthMagic + this.windMagic + this.whiteMagic + this.blackMagic + this.heavySwords + this.hammerWielding + this.bluntWeapons
                        + this.staffFighting + this.axeFighting + this.fencing + this.shortBows + this.longBows + this.crossbows) / 21);

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

    takeMagicalDamage(damage, attackerId, npcOrPlayer, spellAffinity){
        var damageMitigated = Math.floor((((this.arcane + this.blocking) / 10) * (itemData[this.equipHead].magicalDefense + itemData[this.equipTorso].magicalDefense + itemData[this.equipLegs].magicalDefense)) + Math.floor(Math.random() * Math.floor(3)));
        if(damage - damageMitigated <= 0){
            //0 damage
            for (var c in worldMap[this.worldX + '-' + this.worldY].players){
                var remote = players[c].remote;
                remote.showStatus('BLOCK', 'player', this.playerId);
            }
            return
        }
        var chanceToDodge = Math.floor(Math.random() * Math.floor(100 - ((this.agility / 2) + (itemData[this.equipHead].magicalEvasion + itemData[this.equipTorso].magicalEvasion + itemData[this.equipLegs].magicalEvasion))));
        if(chanceToDodge <= 5){
            //dodged it
            for (var c in worldMap[this.worldX + '-' + this.worldY].players){
                var remote = players[c].remote;
                remote.showStatus('MISS', 'player', this.playerId);
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
                winner.getExp(exp, [spellAffinity]);
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

    takePhysicalDamage(damage, attackerId, npcOrPlayer){ //attackerId can be null if player is taking damage from not a player
        var damageMitigated = Math.floor((((this.endurance + this.blocking) / 10) * (itemData[this.equipHead].physicalDefense + itemData[this.equipTorso].physicalDefense + itemData[this.equipLegs].physicalDefense)) + Math.floor(Math.random() * Math.floor(3)));
        if(damage - damageMitigated <= 0){
            //0 damage
            for (var c in worldMap[this.worldX + '-' + this.worldY].players){
                var remote = players[c].remote;
                remote.showStatus('BLOCK', 'player', this.playerId);
            }
            return
        }
        var chanceToDodge = Math.floor(Math.random() * Math.floor(100 - ((this.agility / 2) + (itemData[this.equipHead].physicalEvasion + itemData[this.equipTorso].physicalEvasion + itemData[this.equipLegs].physicalEvasion))));
        if(chanceToDodge <= 5){
            //dodged it
            for (var c in worldMap[this.worldX + '-' + this.worldY].players){
                var remote = players[c].remote;
                remote.showStatus('MISS', 'player', this.playerId);
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
                        this.knifeplayNext = (this.level + this.knifeplay + this.knifeplayNext) * 1.1;

                        this.level = Math.floor((this.swordsmanship + this.mysticism + this.archery + this.knifeplay + this.blocking + this.pugilism + this.fireMagic + this.waterMagic
                            + this.earthMagic + this.windMagic + this.whiteMagic + this.blackMagic + this.heavySwords + this.hammerWielding + this.bluntWeapons
                            + this.staffFighting + this.axeFighting + this.fencing + this.shortBows + this.longBows + this.crossbows) / 21);

                        players[this.playerId].remote.recieveBroadcast("[LEVEL UP] " + this.username + "'s knifeplay is now level: " + this.knifeplay, '#ffffff');
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
                        this.pugilismNext = (this.level + this.pugilism + this.pugilismNext) * 1.1;

                        this.level = Math.floor((this.swordsmanship + this.mysticism + this.archery + this.knifeplay + this.blocking + this.pugilism + this.fireMagic + this.waterMagic
                            + this.earthMagic + this.windMagic + this.whiteMagic + this.blackMagic + this.heavySwords + this.hammerWielding + this.bluntWeapons
                            + this.staffFighting + this.axeFighting + this.fencing + this.shortBows + this.longBows + this.crossbows) / 21);

                        players[this.playerId].remote.recieveBroadcast("[LEVEL UP] " + this.username + "'s pugilism is now level: " + this.pugilism, '#ffffff');
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
                        this.blockingNext = (this.level + this.blocking + this.blockingNext) * 1.1;

                        this.level = Math.floor((this.swordsmanship + this.mysticism + this.archery + this.knifeplay + this.blocking + this.pugilism + this.fireMagic + this.waterMagic
                            + this.earthMagic + this.windMagic + this.whiteMagic + this.blackMagic + this.heavySwords + this.hammerWielding + this.bluntWeapons
                            + this.staffFighting + this.axeFighting + this.fencing + this.shortBows + this.longBows + this.crossbows) / 21);

                        players[this.playerId].remote.recieveBroadcast("[LEVEL UP] " + this.username + "'s blocking is now level: " + this.blocking, '#ffffff');
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
            players[this.playerId].remote.recieveBroadcast("You think: I cannot drop this here...", '#ffffff');
        }

        //Query for if the player is only holding one AND there is an item underneath the player AND that item IS the same as the item being dropped
            //remove from inventory and Increase the Amount of that item on the ground
        if(shouldRemoveItem == true && shouldStackItem == true && isItemUnderneath == true){
            this.inventory[slotNumber - 1].itemId = 1;
            this.inventory[slotNumber - 1].amount = 1;
            worldMap[this.worldX + '-' + this.worldY].items[itemUnderneath.locationId].amount += 1;
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
            players[this.playerId].remote.recieveBroadcast("You think: I cannot drop this here...", '#ffffff');
        }

        //Query for if the player is holding more than one AND there is an item underneath the player AND that item IS the same as the item being dropped
            //Decrement from inventory and Increase the Amount of that item on the ground
        if(shouldRemoveItem == false && shouldStackItem == true && isItemUnderneath == true){
            this.inventory[slotNumber - 1].amount -= 1;
            var inventoryAmount = this.inventory[slotNumber - 1].amount;
            worldMap[this.worldX + '-' + this.worldY].items[itemUnderneath.locationId].amount += 1;
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
        var worldMapString = this.worldX + "-" + this.worldY;
        var playerId = this.playerId;
        var myState = this;
        con.query(queryString, function (err, result, fields) {if (err) throw err; worldMap[worldMapString].players[playerId] = myState});
    }

    unequipQuery(queryString){
        var worldMapString = this.worldX + "-" + this.worldY;
        var playerId = this.playerId;
        var myState = this;
        con.query(queryString, function (err, result, fields) {if (err) throw err; worldMap[worldMapString].players[playerId] = myState});
    }
};

module.exports = PlayerState;