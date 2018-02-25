//Utility functions for the server to handle player actions

module.exports = {
    movePlayer: function(state, payload){
        var x = state.pos.x;
        var y = state.pos.y;
        var newAction = '';

        //Need to write something to check if movement is valid
        
        switch(payload){
            case 'E': {
                x = x + 1;
                if(x > 11){
                    x = 1;
                    state.changeMapData(state.worldX + 1, state.worldY);
                }
                newAction = 'walk';
                state.playerFacing = payload;
                break;
            }
            case 'W': {
                x = x - 1;
                if(x < 1){
                    x = 11;
                    state.changeMapData(state.worldX - 1, state.worldY);
                }
                newAction = 'walk';
                state.playerFacing = payload;
                break;
            }
            case 'N': {
                y = y - 1;
                if(y < 1){
                    y = 16;
                    state.changeMapData(state.worldX, state.worldY - 1);
                }
                newAction = 'walk';
                state.playerFacing = payload;
                break;
            }
            case 'S': {
                y = y + 1;
                if(y > 16){
                    y = 1;
                    state.changeMapData(state.worldX, state.worldY + 1);
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
    }

    //Need to write other server actions like attack
}