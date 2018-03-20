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
                    if(thisItem.localX == playerLocalPos.x + 1 && thisItem.localY == playerLocalPos.y){
                        console.log("would have picked up item")
                    }
                }
                break;
            }
            case 'W': {
                for(var i in mapItems){
                    thisItem = mapItems[i];
                    if(thisItem.localX == playerLocalPos.x - 1 && thisItem.localY == playerLocalPos.y){
                        console.log("would have picked up item")
                    }
                }
                break;
            }
            case 'N': {
                for(var i in mapItems){
                    thisItem = mapItems[i];
                    if(thisItem.localX == playerLocalPos.x && thisItem.localY == playerLocalPos.y - 1){
                        console.log("would have picked up item")
                    }
                }
                break;
            }
            case 'S': {
                for(var i in mapItems){
                    thisItem = mapItems[i];
                    if(thisItem.localX == playerLocalPos.x && thisItem.localY == playerLocalPos.y + 1){
                        console.log("would have picked up item")
                    }
                }
                break;
            }
            default: {
                console.log("shouldn't see this");
                return;
            }
        }
    }
}