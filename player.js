var PlayerObject = PlayerObject || {};

var PlayerObject = function(idRef, gameRef){
    var game = gameRef; //Reference to game object
    var id = idRef; //Local player's id
    var playerState = game.global.player; //player's current state

    function init(idRef, gameRef){
        game = gameRef;
        id = idRef;
        playerState = game.global.player;
    }

    function update(){
        if(playerState != game.global.player){
            playerState = game.global.player;
        }
        else{
            console.log("discarding");
        }
        

    }

    init(idRef, gameRef);
    
    return {
        game: game,
        id: id,
        playerState: playerState
    };
}