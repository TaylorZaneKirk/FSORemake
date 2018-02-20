var PlayerObject = PlayerObject || {};

var PlayerObject = function(idRef, gameRef){
    var game = null; //Reference to game object
    var id = null; //Local player's id
    var playerState = null; //player's current state
    var playerSprite = null;

    function init(idRef, gameRef){
        game = gameRef;
        id = idRef;
        playerState = game.global.player;
        playerSprite = game.add.sprite(playerState.pos.x, playerState.pos.y, 'player');
        playerSprite.animations.add('walk-e', [0,1,2], 6, true);
        playerSprite.animations.add('walk-w', [4,5,6], 6, true);
        playerSprite.animations.add('walk-s', [8,9,10], 6, true);
        playerSprite.animations.add('walk-n', [12,13,14], 6, true);
        playerSprite.play('walk-w');
    }

    function update(){
        if(playerState != game.global.player){
            playerState = game.global.player;

            //Update global reference
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