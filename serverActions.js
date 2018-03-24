//Utility functions for the server to handle player actions

module.exports = {
    movePlayer: function(state, payload){
        var x = state.pos.x;
        var y = state.pos.y;
        var newAction = '';

        //Need to write something to check if movement is valid
        
        switch(payload){
            case 'E': {
                if(x + 1 > 16){
                    x = 0;
                    state.changeMapData(state.worldX + 1, state.worldY);
                }
                else if(state.takeStep(x + 1, y)){
                    x = x + 1;
                }
                
                newAction = 'walk';
                state.playerFacing = payload;
                break;
            }
            case 'W': {
                if(x - 1 < 0){
                    x = 16;
                    state.changeMapData(state.worldX - 1, state.worldY);
                }
                else if(state.takeStep(x - 1, y)){
                    x = x - 1;
                }

                newAction = 'walk';
                state.playerFacing = payload;
                break;
            }
            case 'N': {
                if(y - 1 < 0){
                    y = 11;
                    state.changeMapData(state.worldX, state.worldY - 1);
                }
                else if(state.takeStep(x, y - 1)){
                    y = y - 1;
                }
                newAction = 'walk';
                state.playerFacing = payload;
                break;
            }
            case 'S': {
                if(y + 1 > 11){
                    y = 0;
                    state.changeMapData(state.worldX, state.worldY + 1);
                }
                else if(state.takeStep(x, y + 1)){
                    y = y + 1;
                }

                newAction = 'walk';
                state.playerFacing = payload;
                break;
            }
            default: {
                
                newAction = 'idle';
            }
        }
        
        state.pos = {x: x, y: y};
        state.readyToUpdate = true;
        state.playerAction = newAction;
    },

    //Need to write other server actions like attack
    broadcastMessage: function(playersArray, id, payload, target){
        var broadcastingPlayer = playersArray[id];

        if(target == 'local'){
            var messageToBroadcastToOthers = broadcastingPlayer.state.username + " says: " + payload;
            var messageToBroadcastToSelf = "You say: " + payload;

            for( var i in broadcastingPlayer.state.playersVisible ){
                var index = broadcastingPlayer.state.playersVisible[i].playerId;
                var visiblePlayer = playersArray[index];
                var remote = visiblePlayer.remote;
                remote.recieveBroadcast(messageToBroadcastToOthers, '#ffffff');
            }

            broadcastingPlayer.remote.recieveBroadcast(messageToBroadcastToSelf, '#ffffff');
        }
        else if(target == 'all'){
            var messageToBroadcast = broadcastingPlayer.state.username + ": " + payload;

            for(var i in playersArray){
                var remote = playersArray[i].remote;
                remote.recieveBroadcast(messageToBroadcast, '#ffff00');
            }
        }
        
    },

    playerAttack: function(playersArray, id, payload, target){
        var attackingPlayer = playersArray[id];
        attackingPlayer.state.playerAction = 'attack';
        
        if(target == 'player'){
            var targetCoords = payload;
            
            for(var i in attackingPlayer.state.playersVisible){
                var player = attackingPlayer.state.playersVisible[i];

                if(player.pos.x == targetCoords.x && player.pos.y == targetCoords.y){
                    var playerAttacked = playersArray[player.playerId];
                    playerAttacked.state.takeDamage(5, id); //Should pass a parameter containing the weapon being used?
                }
            }
        }
    },

    pickUpItem: function(state){
        var playerLocalPos = state.pos;
        var playerFacing = state.playerFacing;
        var mapItems = state.mapData.items;
        var thisItem = null;

        switch(playerFacing){
            case 'E': {
                for(var i in mapItems){
                    thisItem = mapItems[i];
                    if(thisItem.pos.x == playerLocalPos.x + 1 && thisItem.pos.y == playerLocalPos.y){
                        state.getItem(thisItem.locationId);
                    }
                }
                break;
            }
            case 'W': {
                for(var i in mapItems){
                    thisItem = mapItems[i];
                    if(thisItem.pos.x == playerLocalPos.x - 1 && thisItem.pos.y == playerLocalPos.y){
                        state.getItem(thisItem.locationId);
                    }
                }
                break;
            }
            case 'N': {
                for(var i in mapItems){
                    thisItem = mapItems[i];
                    if(thisItem.pos.x == playerLocalPos.x && thisItem.pos.y == playerLocalPos.y - 1){
                        state.getItem(thisItem.locationId);
                    }
                }
                break;
            }
            case 'S': {
                for(var i in mapItems){
                    thisItem = mapItems[i];
                    if(thisItem.pos.x == playerLocalPos.x && thisItem.pos.y == playerLocalPos.y + 1){
                        state.getItem(thisItem.locationId);
                    }
                }
                break;
            }
            default: {
                console.log("shouldn't see this");
                return;
            }
        }
    },

    equipItem(player, message, itemData){
        var targetInventorySlot = message.action.payload;
        var targetEquipSlot = message.target;
        var thisItemId = player.inventory[targetInventorySlot - 1].itemId;
        var thisItemAmount = player.inventory[targetInventorySlot - 1].amount;
        var thisItemData = itemData[thisItemId];
        var thisEquipment = player['equip' + targetEquipSlot];
        var equipToInventorySlot = null;
        var shouldStack = false;
        var stackAmount = 1;

        if(thisEquipment != 1){
            //Find Slot to place item
            for(var i = 0; i < player.inventory.length; i++){
                var item = player.inventory[i];
                var itemSlot = parseInt(i) + 1;
                if (item.itemId == 1){
                    //place item here
                    equipToInventorySlot = itemSlot;
                }
                if(item.itemId == thisEquipment && item.amount < 99){
                    //Already holding that item, and holding less than 99
                    shouldStack = true;
                    stackAmount = item.amount;
                    equipToInventorySlot = itemSlot;
                    break;
                }
            }
        }

        //If thisEquipment == Nothing, just remove item from inventory and place into equip slot
        if(equipToInventorySlot == null){
            thisItemAmount--;
            if(thisItemAmount == 0){
                //remove what that item was and replace with NOTHING
                console.log("case 1");
                player.equipQuery("UPDATE playerInv SET slot" + targetInventorySlot + "=" + thisEquipment + ", slot" + targetInventorySlot + "Amount = 1, equip" + targetEquipSlot + "=" + thisItemId + " WHERE username = '" + player.username + "'");
                player['equip' + targetEquipSlot] = thisItemId;
                player.inventory[targetInventorySlot - 1].itemId = 1; //Nothing
                player.inventory[targetInventorySlot - 1].amount = 1;
            }
            else{
                //decrement the amount of the stacked item
                console.log("case 2");
                player.equipQuery("UPDATE playerInv SET slot" + targetInventorySlot + "Amount=" + thisItemAmount + ", equip" + targetEquipSlot + "=" + thisItemId + " WHERE username = '" + player.username + "'");
                player['equip' + targetEquipSlot] = thisItemId;
                player.inventory[targetInventorySlot - 1].amount -= 1;
            }
        }
        else{
            //If thisEquipment != Nothing, remove item from inventory, remove thisEquipment, place item into thisEquipment, place thisEquipment into targetslot
            thisItemAmount--;
            if(shouldStack){
                stackAmount++;
            }
            if(thisItemAmount == 0){
                //remove what that item was and replace with item that was equipped
                console.log("case 3");
                player.equipQuery("UPDATE playerInv SET slot" + equipToInventorySlot + "=" + thisEquipment + ", slot" + targetInventorySlot + "=1, slot" + targetInventorySlot + "Amount=1, slot" + equipToInventorySlot + "Amount=" + stackAmount + ", equip" + targetEquipSlot + "=" + thisItemId + " WHERE username = '" + player.username + "'");
                player.inventory[equipToInventorySlot - 1] = {itemId: thisEquipment, amount: stackAmount};
                var temp = thisEquipment;
                player['equip' + targetEquipSlot] = thisItemId;
                player.inventory[targetInventorySlot - 1].itemId = 1;
                player.inventory[targetInventorySlot - 1].amount = 1;
            }
            else{
                //decrement the amount of the stacked item and place the item that was equipped into inventory
                console.log("case 4");
                if(equipToInventorySlot == targetInventorySlot){
                    return;
                }
                player.equipQuery("UPDATE playerInv SET slot" + equipToInventorySlot + "=" + thisEquipment + ", slot" + targetInventorySlot + "Amount=" + thisItemAmount + ", slot" + equipToInventorySlot + "Amount=" + stackAmount + ", equip" + targetEquipSlot + "=" + thisItemId + " WHERE username = '" + player.username + "'");
                player.inventory[equipToInventorySlot - 1] = {itemId: thisEquipment, amount: stackAmount};
                player['equip' + targetEquipSlot] = thisItemId;
                player.inventory[targetInventorySlot - 1].amount -= 1;
            }
        }
    }
}