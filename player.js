var PlayerObject = PlayerObject || {};

var PlayerObject = function(idRef, gameRef){
    var game = null; //Reference to game object
    var idLocal = null; //Local player's id
    var playerState = null; //player's current state
    var playerSprite = null;
    var currentAction = null;
    var upKey = null;
    var downKey = null;
    var leftKey = null;
    var rightKey = null;
    var ready = null;
    var playerTween = null;

    function init(idRef, gameRef){
        game = gameRef;
        idLocal = idRef;
        playerState = game.global.playerList[idLocal].player;
        ready = false;
        
        upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
        downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
        leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        tabKey = game.input.keyboard.addKey(Phaser.Keyboard.TAB);

        playerSprite = game.add.sprite((playerState.pos.x+1)*32, (playerState.pos.y+1)*32, 'player');
        game.physics.arcade.enable(playerSprite);
        playerSprite.anchor.setTo(0.1430,0.15);
        playerSprite.enableBody = true;
        //playerSprite.body.enable = true;
        playerSprite.body.collideWorldBounds = true;
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
        playerSprite.animations.add('attack-E', [1,3,1], 6, false);
        playerSprite.animations.add('attack-W', [5,7,5], 6, false);
        playerSprite.animations.add('attack-N', [9,11,9], 6, false);
        playerSprite.animations.add('attack-S', [13,15,13], 6, false);
        playerSprite.animations.add('idle-E', [1], 1, false);
        playerSprite.animations.add('idle-W', [5], 1, false);
        playerSprite.animations.add('idle-N', [9], 1, false);
        playerSprite.animations.add('idle-S', [13], 1, false);
        playerSprite.play('idle-' + playerState.playerFacing);

        playerTween = game.add.tween(playerSprite);
    }

    function update(){

        //Change this to localPlayer pos checking against playerState.pos
        /* if(!ready){
            ready = true;
        } */
        if(game.global.playerList[idLocal].player == undefined){
            console.log(game.global.playerList);
            return;
        }

        if(playerState != game.global.playerList[idLocal].player && playerState.playerName == game.global.playerList[idLocal].player.playerName){
            playerState = game.global.playerList[idLocal].player;

            //Update global reference
            game.global.playerList[idLocal].localPlayerObject = {
                game: game,
                id: idLocal,
                playerState: playerState,
                update: update,
                playerSprite: playerSprite,
                playerTween: playerTween,
                movePlayer: movePlayer,
            };

            game.global.localPlayerObject = game.global.playerList[idLocal].localPlayerObject;
        }

        /* if(playerTween.isRunning){
            console.log("currently moving, no need to update");
            return;
        } */
        if(tabKey.isDown){
            playerState.playerAction = 'attack';
            playerSprite.play(playerState.playerAction + '-' + playerState.playerFacing);
        }

        if (((playerState.pos.x+1)*32 == Math.ceil(playerSprite.x) && (playerState.pos.y+1)*32 == Math.ceil(playerSprite.y)) && playerState.playerAction != 'idle' && playerState.readyToUpdate){
            playerState.playerAction = 'idle';
            //playerState.readyToUpdate = true;
            sendMessageToServer({type: 'move', payload: 'I'}, 'self');
        }
        

        else if(playerState.playerAction == 'idle' && playerState.readyToUpdate){
            if (leftKey.isDown){
                playerState.playerAction = 'walk';
                playerState.playerFacing = 'W';
                ready = false;
                if(game.global.mapManager.isSpotAvailable(playerState.pos.x - 1, playerState.pos.y)){
                    playerState.pos.x--;
                    sendMessageToServer({type: 'move', payload: 'W'}, 'self');
                }
                
                //gameRef.add.tween(playerSprite).to({x: ((playerState.pos.x+1)-1) * 32, y: (playerState.pos.y+1) * 32}, 1000, null, true);
                //playerSprite.body.velocity.x -= 1; //arcade physics required for body.velocity to work
            }
            else if (rightKey.isDown){
                playerState.playerAction = 'walk';
                playerState.playerFacing = 'E';
                ready = false;
                if(game.global.mapManager.isSpotAvailable(playerState.pos.x + 1, playerState.pos.y)){
                    playerState.pos.x++;
                    sendMessageToServer({type: 'move', payload: 'E'}, 'self');
                }
                
                //gameRef.add.tween(playerSprite).to({x: ((playerState.pos.x+1)+1) * 32, y: (playerState.pos.y+1) * 32}, 1000, null, true);
                //playerSprite.body.velocity.x += 1;
            }
            else if (upKey.isDown){
                playerState.playerAction = 'walk';
                playerState.playerFacing = 'N';
                ready = false;
                if(game.global.mapManager.isSpotAvailable(playerState.pos.x, playerState.pos.y - 1)){
                    playerState.pos.y--;
                    sendMessageToServer({type: 'move', payload: 'N'}, 'self');
                }
                
                //gameRef.add.tween(playerSprite).to({x: (playerState.pos.x+1) * 32, y: ((playerState.pos.y+1)-1) * 32}, 1000, null, true);
                //playerSprite.body.velocity.y -= 1;
            }
            else if (downKey.isDown){
                playerState.playerAction = 'walk';
                playerState.playerFacing = 'S';
                ready = false;
                if(game.global.mapManager.isSpotAvailable(playerState.pos.x, playerState.pos.y + 1)){
                    playerState.pos.y++;
                    sendMessageToServer({type: 'move', payload: 'S'}, 'self');
                }
                
                //gameRef.add.tween(playerSprite).to({x: (playerState.pos.x+1) * 32, y: ((playerState.pos.y+1)+1) * 32}, 1000, null, true);
                //playerSprite.body.velocity.y += 1;
            }
            
        }
        
        if((((playerState.pos.x+1) * 32) != Math.ceil(playerSprite.x) || ((playerState.pos.y+1) * 32) != Math.ceil(playerSprite.y)) ){
            //Player is moving and we're waiting for a response from server

            playerTween = moveSprite(playerTween, playerState.pos, playerSprite);
        }
        playerSprite.play(playerState.playerAction + '-' + playerState.playerFacing);
    }

    //Function to handle moving the sprites, if the tween
    //  is already running simply return it so that it can
    //  complete. Otherwise, replace the old tween data with new tween
    moveSprite = function(tween, pos, sprite){
        if(tween != undefined && !tween.isRunning){
            tween = game.add.tween(sprite).to({x: ((pos.x+1)) * 32, y: (pos.y+1) * 32}, 750, null, true);
        }
        return tween;
    }

    movePlayer = function(id){
        //Get references
        var otherPlayer = game.global.playerList[id].player;
        var otherSprite = game.global.playerList[id].localPlayerObject.playerSprite;
        var otherTween = game.global.playerList[id].localPlayerObject.playerTween;

        if(otherPlayer.playerAction == 'walk'){
            //server told us the player is moving
            otherTween = moveSprite(otherTween, otherPlayer.pos, otherSprite);
        }
        else if(((otherPlayer.pos.x+1) * 32) != Math.ceil(otherSprite.x) || ((otherPlayer.pos.y+1) * 32) != Math.ceil(otherSprite.y)){
            //Server says the player is idle, put their coordinates don't match ours,
            //  so we'll "infer" the movement locally
            otherPlayer.playerAction = "walk";
            otherTween = moveSprite(otherTween, otherPlayer.pos, otherSprite);
        }

        //Set references
        game.global.playerList[id].localPlayerObject.playerSprite = otherSprite;
        game.global.playerList[id].localPlayerObject.playerTween = otherTween;
        otherSprite.play(otherPlayer.playerAction + '-' + otherPlayer.playerFacing);

        
    }

    init(idRef, gameRef);
    
    return {
        game: game,
        id: idLocal,
        playerState: playerState,
        update: update,
        playerSprite: playerSprite,
        playerTween: playerTween,
        movePlayer: movePlayer,
    };
}