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
        playerSprite.animations.add('walk-E', [0,1,2], 6, false);
        playerSprite.animations.add('walk-W', [4,5,6], 6, false);
        playerSprite.animations.add('walk-N', [8,9,10], 6, false);
        playerSprite.animations.add('walk-S', [12,13,14], 6, false);
        playerSprite.animations.add('idle-E', 1, 1, true);
        playerSprite.animations.add('idle-W', 5, 1, true);
        playerSprite.animations.add('idle-N', 9, 1, true);
        playerSprite.animations.add('idle-S', 13, 1, true);
        playerSprite.play('idle-S');
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