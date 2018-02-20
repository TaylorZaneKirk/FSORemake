var PlayerObject = PlayerObject || {};

var PlayerObject = function(idRef, gameRef){
    var game = gameRef; //Reference to game object
    var id = idRef; //Local player's id
    var playerState = game.global.player; //player's current state

    console.log({
        game: game,
        id: id,
        playerState: playerState
    })
    
    return {
        game: game,
        id: id,
        playerState: playerState
    };
}