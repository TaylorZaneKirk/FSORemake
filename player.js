var PlayerObject = PlayerObject || {};

function PlayerObject(idRef, gameRef){
    var game = gameRef; //Reference to game object
    var id = idRef; //Local player's id
    var playerState = game.global.player; //player's current state
    
    return {
        game: game,
        id: id,
        playerState: playerState
    };
}