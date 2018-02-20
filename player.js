var PlayerObject = PlayerObject || {};

function PlayerObject(id, game){
    var game = game; //Reference to game object
    var id = id; //Local player's id
    var playerState = game.global.player; //player's current state
    
    return {
        game: this.game,
        id: this.id,
        playerState: this.playerState
    };
}