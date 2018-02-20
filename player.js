var PlayerObject = PlayerObject || {};

var PlayerObject = function(idRef, gameRef){
    var game = null; //Reference to game object
    var id = null; //Local player's id
    var playerState = null; //player's current state

    function init(idRef, gameRef){
        game = gameRef;
        id = idRef;
        playerState = game.global.player;
    }

    function update(){
        if(playerState != game.global.player){
            playerState = game.global.player;
            console.log("replaced");
            console.log(playerState);
            game.global.localPlayerObject = {
                game: game,
                id: id,
                playerState: playerState,
                update: update,
            };
        }
        

    }

    init(idRef, gameRef);
    
    return {
        game: game,
        id: id,
        playerState: playerState,
        update: update,
    };
}