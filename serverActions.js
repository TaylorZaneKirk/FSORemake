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
                newAction = 'walk';
                state.playerFacing = payload;
                break;
            }
            case 'W': {
                x = x - 1;
                newAction = 'walk';
                state.playerFacing = payload;
                break;
            }
            case 'N': {
                y = y - 1;
                newAction = 'walk';
                state.playerFacing = payload;
                break;
            }
            case 'S': {
                y = y + 1;
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