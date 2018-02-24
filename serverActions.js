module.exports = {
    movePlayer: function(state, payload){
        var x = state.pos.x;
        var y = state.pos.y;
        var newAction = '';

        
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
        console.log(state.pos.x + "," + state.pos.y + " " + state.playerName);
    }
}