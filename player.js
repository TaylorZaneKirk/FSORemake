var PlayerObject = PlayerObject || {};

var PlayerObject = function(idRef, gameRef){
    var game = null; //Reference to game object
    var id = null; //Local player's id
    var playerState = null; //player's current state
    var playerSprite = null;
    var currentAction = null;
    var upKey = null;
    var downKey = null;
    var leftKey = null;
    var rightKey = null;
    var ready = null;

    function init(idRef, gameRef){
        game = gameRef;
        id = idRef;
        playerState = game.global.player;
        ready = false;
        
        upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
        downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
        leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);

        playerSprite = game.add.sprite(5, 5, 'player');
        game.physics.arcade.enable(playerSprite);
        playerSprite.anchor.setTo(0.125,0);
        playerSprite.enableBody = true;
        //playerSprite.body.enable = true;
        //playerSprite.body.collideWorldBounds = true;
        playerSprite.body.immovable = false;
        playerSprite.body.bounce.setTo(0, 0);
        playerSprite.body.setSize(
            playerSprite.body.width * 0.6,
            playerSprite.body.height * 0.5,
            playerSprite.body.width * 0.2,
            playerSprite.body.height * 0.5
        );
        //playerSprite.inputEnabled = true;
        playerSprite.animations.add('walk-E', [0,1,2], 6, false);
        playerSprite.animations.add('walk-W', [4,5,6], 6, false);
        playerSprite.animations.add('walk-N', [8,9,10], 6, false);
        playerSprite.animations.add('walk-S', [12,13,14], 6, false);
        playerSprite.animations.add('idle-E', [1], 1, false);
        playerSprite.animations.add('idle-W', [5], 1, false);
        playerSprite.animations.add('idle-N', [9], 1, false);
        playerSprite.animations.add('idle-S', [13], 1, false);

        console.log(playerState);
    }

    function update(){

        //Change this to localPlayer pos checking against playerState.pos
        if(!ready){
            ready = true;
        }

        if(!ready) { return; }

        if(playerState != game.global.player){
            playerState = game.global.player;

            //Update global reference
            game.global.localPlayerObject = {
                game: game,
                id: id,
                playerState: playerState,
                update: update,
                playerSprite: playerSprite,
            };
        }

        if (leftKey.isDown){
            playerState.playerAction = 'walk';
            playerState.playerFacing = 'W';
            ready = false;
            sendMessageToServer({type: 'move', payload: 'W'}, 'self');
            playerSprite.body.velocity.x -= 1; //arcade physics required for body.velocity to work
        }
        else if (rightKey.isDown){
            playerState.playerAction = 'walk';
            playerState.playerFacing = 'E';
            ready = false;
            sendMessageToServer({type: 'move', payload: 'E'}, 'self');
            playerSprite.body.velocity.x += 1;
        }
        else if (upKey.isDown){
            playerState.playerAction = 'walk';
            playerState.playerFacing = 'N';
            ready = false;
            sendMessageToServer({type: 'move', payload: 'N'}, 'self');
            playerSprite.body.velocity.y -= 1;
        }
        else if (downKey.isDown){
            playerState.playerAction = 'walk';
            playerState.playerFacing = 'S';
            ready = false;
            sendMessageToServer({type: 'move', payload: 'S'}, 'self');
            playerSprite.body.velocity.y += 1;
        }
        
        
        playerSprite.play(playerState.playerAction + '-' + playerState.playerFacing);
    }

    init(idRef, gameRef);
    
    return {
        game: game,
        id: id,
        playerState: playerState,
        update: update,
        playerSprite: playerSprite,
    };
}