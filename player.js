var PlayerObject = PlayerObject || {};

var PlayerObject = function(idRef, gameRef){
    var game = null; //Reference to game object
    var idLocal = null; //Local player's id
    var playerState = null; //player's current state
    var playerSprite = null;
    var playerHead = null;
    var playerRight = null;
    var playerLeft = null;
    var currentAction = null;
    var upKey = null;
    var downKey = null;
    var leftKey = null;
    var rightKey = null;
    var ready = null;
    var playerTween = null;
    var playerName = null;
    var playerImage = {
        head: null,
        torso: null,
        right: null,
        left: null,
        legs: null,
        extra: null,
    };

    function init(idRef, gameRef){
        game = gameRef;
        idLocal = idRef;
        playerState = game.global.playerList[idLocal].player;
        ready = false;
        
        upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
        downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
        leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        altKey = game.input.keyboard.addKey(Phaser.Keyboard.ALT);
        shiftKey = game.input.keyboard.addKey(Phaser.Keyboard.SHIFT);

        //Head Sprite (and Body)
        if(playerState.gender == 'm'){
            //playerSprite = game.add.sprite((playerState.pos.x+1)*32, (playerState.pos.y+1)*32, 'player');
            playerSprite = game.add.sprite((playerState.pos.x+1)*32, (playerState.pos.y+1)*32, 'defaultBody');
            playerImage.torso = game.add.sprite(game.world.width * 0.8425, game.world.centerY * 1.075, 'defaultBody');
            playerHead = game.add.sprite(-6.5, -7, 'maleHead1');
            playerImage.head = game.add.sprite(-6.5, -7, 'maleHead1');
            playerSprite.addChild(playerHead);
            playerImage.torso.addChild(playerImage.head);
        }
        else{
            //playerSprite = game.add.sprite((playerState.pos.x+1)*32, (playerState.pos.y+1)*32, 'player2');
            playerSprite = game.add.sprite((playerState.pos.x+1)*32, (playerState.pos.y+1)*32, 'defaultBody');
            playerImage.torso = game.add.sprite(game.world.width * 0.8425, game.world.centerY * 1.075, 'defaultBody');
            playerHead = game.add.sprite(-6.5, -7, 'femaleHead1');
            playerImage.head = game.add.sprite(-6.5, -7, 'femaleHead1');
            playerSprite.addChild(playerHead);
            playerImage.torso.addChild(playerImage.head);
        }

        //Right Arm Sprite
        var equipRightName = game.global.itemManager.getItemName(playerState.equipRight);
        playerRight = game.add.sprite(17, 17, equipRightName + "Right");
        playerImage.right = game.add.sprite(17, 17, equipRightName + "Right");
        playerRight.anchor.setTo(0.5);
        playerImage.right.anchor.setTo(0.5);
        playerSprite.addChild(playerRight);
        playerImage.torso.addChild(playerImage.right);

        //Left Arm Sprite
        var equipLeftName = game.global.itemManager.getItemName(playerState.equipLeft);
        playerLeft = game.add.sprite(17, 17, equipLeftName + "Left");
        playerImage.left = game.add.sprite(17, 17, equipLeftName + "Left");
        playerLeft.anchor.setTo(0.5);
        playerImage.left.anchor.setTo(0.5);
        playerSprite.addChild(playerLeft);
        playerImage.torso.addChild(playerImage.left);
        
        playerSprite.inputEnabled = true;
        playerName = game.add.text(15, -10, playerState.username, { font: "14px Ariel", fill: '#ffffff'});
        playerName.alpha = 0;
        playerSprite.events.onInputOver.add(showPlayerName, this);
        playerSprite.events.onInputOut.add(hidePlayerName, this);
        playerName.anchor.setTo(0.5);
        playerSprite.addChild(playerName);
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
        playerSprite.animations.add('walk-E', [0,1,2], 6, true);
        playerSprite.animations.add('walk-W', [4,5,6], 6, true);
        playerSprite.animations.add('walk-N', [8,9,10], 6, true);
        playerSprite.animations.add('walk-S', [12,13,14], 6, true);
        playerSprite.animations.add('attack-E', [1,3,1], 3, false);
        playerSprite.animations.add('attack-W', [5,7,5], 3, false);
        playerSprite.animations.add('attack-N', [9,11,9], 3, false);
        playerSprite.animations.add('attack-S', [13,15,13], 3, false);
        playerSprite.animations.add('idle-E', [1], 1, false);
        playerSprite.animations.add('idle-W', [5], 1, false);
        playerSprite.animations.add('idle-N', [9], 1, false);
        playerSprite.animations.add('idle-S', [13], 1, false);
        playerSprite.play('idle-' + playerState.playerFacing);

        playerHead.animations.add('walk-E', [0,1,2], 6, true);
        playerHead.animations.add('walk-W', [4,5,6], 6, true);
        playerHead.animations.add('walk-N', [8,9,10], 6, true);
        playerHead.animations.add('walk-S', [12,13,14], 6, true);
        playerHead.animations.add('attack-E', [1,3,1], 3, false);
        playerHead.animations.add('attack-W', [5,7,5], 3, false);
        playerHead.animations.add('attack-N', [9,11,9], 3, false);
        playerHead.animations.add('attack-S', [13,15,13], 3, false);
        playerHead.animations.add('idle-E', [1], 1, false);
        playerHead.animations.add('idle-W', [5], 1, false);
        playerHead.animations.add('idle-N', [9], 1, false);
        playerHead.animations.add('idle-S', [13], 1, false);
        playerHead.frame = playerSprite.frame;

        playerRight.animations.add('walk-E', [0,1,2], 6, true);
        playerRight.animations.add('walk-W', [4,5,6], 6, true);
        playerRight.animations.add('walk-N', [8,9,10], 6, true);
        playerRight.animations.add('walk-S', [12,13,14], 6, true);
        playerRight.animations.add('attack-E', [1,3,1], 3, false);
        playerRight.animations.add('attack-W', [5,7,5], 3, false);
        playerRight.animations.add('attack-N', [9,11,9], 3, false);
        playerRight.animations.add('attack-S', [13,15,13], 3, false);
        playerRight.animations.add('idle-E', [1], 1, false);
        playerRight.animations.add('idle-W', [5], 1, false);
        playerRight.animations.add('idle-N', [9], 1, false);
        playerRight.animations.add('idle-S', [13], 1, false);
        playerRight.frame = playerSprite.frame;

        playerLeft.animations.add('walk-E', [0,1,2], 6, true);
        playerLeft.animations.add('walk-W', [4,5,6], 6, true);
        playerLeft.animations.add('walk-N', [8,9,10], 6, true);
        playerLeft.animations.add('walk-S', [12,13,14], 6, true);
        playerLeft.animations.add('attack-E', [1,3,1], 3, false);
        playerLeft.animations.add('attack-W', [5,7,5], 3, false);
        playerLeft.animations.add('attack-N', [9,11,9], 3, false);
        playerLeft.animations.add('attack-S', [13,15,13], 3, false);
        playerLeft.animations.add('idle-E', [1], 1, false);
        playerLeft.animations.add('idle-W', [5], 1, false);
        playerLeft.animations.add('idle-N', [9], 1, false);
        playerLeft.animations.add('idle-S', [13], 1, false);
        playerLeft.frame = playerSprite.frame;

        playerTween = game.add.tween(playerSprite);
        playerImage.head.animations = playerHead.animations;
        playerImage.torso.animations = playerSprite.animations;
        playerImage.right.animations = playerRight.animations;
        playerImage.left.animations = playerLeft.animations;
        playerImage.torso.play('idle-S');
        playerImage.alpha = 0;
        //playerImage.position = {x: game.world.width * 0.875, y: game.world.centerY * 1.14};
        //playerImage.play('idle-S');
    }

    function showPlayerName(state){
        playerName.alpha = 1;
    }

    function hidePlayerName(state){
        playerName.alpha = 0;
    }

    function update(){

        if(game.global.playerList[idLocal].player == undefined){
            console.log(game.global.playerList);
            return;
        }

        if(playerState != game.global.playerList[idLocal].player && playerState.playerId == game.global.playerList[idLocal].player.playerId){
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
                changeEquipmentSprites: changeEquipmentSprites,
                playerImage: playerImage,
            };

            game.global.localPlayerObject = game.global.playerList[idLocal].localPlayerObject;
        }


        if (((playerState.pos.x+1)*32 == Math.ceil(playerSprite.x) 
            && (playerState.pos.y+1)*32 == Math.ceil(playerSprite.y)) 
            && playerState.playerAction == 'walk'){
            //Player reached their intended location. Set them to idle and update server
            
            playerState.playerAction = 'idle';
            game.global.actionQueue.push({action: {type: 'move', payload: 'I'}, target: 'self'});
        }
        else if(playerState.playerAction == 'idle'){
            //Detect key presses

            if(altKey.isDown && playerState.readyToUpdate){
                playerState.playerAction = 'attack';
                var targetCoords = {x: playerState.pos.x, y: playerState.pos.y};

                if(playerState.playerFacing == 'N'){ targetCoords.y--; }
                if(playerState.playerFacing == 'S'){ targetCoords.y++; }
                if(playerState.playerFacing == 'E'){ targetCoords.x++; }
                if(playerState.playerFacing == 'W'){ targetCoords.x--; }

                for(var i in playerState.playersVisible){
                    var player = playerState.playersVisible[i];
                    if(player.pos.x == targetCoords.x && player.pos.y == targetCoords.y){
                        game.global.actionQueue.push({action: {type: 'attack', payload: targetCoords}, target:'player'});
                    }
                }
            }
            else if (leftKey.isDown){
                playerState.playerAction = 'walk';
                playerState.playerFacing = 'W';
                if(game.global.mapManager.isSpotAvailable(playerState.pos.x - 1, playerState.pos.y, playerState.pos)){
                    var canMove = true;
                    for(var i in playerState.playersVisible){
                        var player = playerState.playersVisible[i];
                        if(player.pos.x == playerState.pos.x - 1 && player.pos.y == playerState.pos.y){
                            canMove = false;
                        }
                    }
                    if(canMove) {
                        playerState.pos.x--;
                        game.global.actionQueue.push({action: {type: 'move', payload: 'W'}, target: 'self'});
                    }
                }  
            }
            else if (rightKey.isDown){
                playerState.playerAction = 'walk';
                playerState.playerFacing = 'E';
                if(game.global.mapManager.isSpotAvailable(playerState.pos.x + 1, playerState.pos.y, playerState.pos)){
                    var canMove = true;
                    for(var i in playerState.playersVisible){
                        var player = playerState.playersVisible[i];
                        if(player.pos.x == playerState.pos.x + 1 && player.pos.y == playerState.pos.y){
                            canMove = false;
                        }
                    }
                    if(canMove) {
                        playerState.pos.x++;
                        game.global.actionQueue.push({action: {type: 'move', payload: 'E'}, target: 'self'});
                    }
                }  
            }
            else if (upKey.isDown){
                playerState.playerAction = 'walk';
                playerState.playerFacing = 'N';
                if(game.global.mapManager.isSpotAvailable(playerState.pos.x, playerState.pos.y - 1, playerState.pos)){
                    var canMove = true;
                    for(var i in playerState.playersVisible){
                        var player = playerState.playersVisible[i];
                        if(player.pos.x == playerState.pos.x && player.pos.y == playerState.pos.y - 1){
                            canMove = false;
                        }
                    }
                    if(canMove) {
                        playerState.pos.y--;
                        game.global.actionQueue.push({action: {type: 'move', payload: 'N'}, target: 'self'});
                    }
                }
            }
            else if (downKey.isDown){
                playerState.playerAction = 'walk';
                playerState.playerFacing = 'S';
                if(game.global.mapManager.isSpotAvailable(playerState.pos.x, playerState.pos.y + 1, playerState.pos)){
                    var canMove = true;
                    for(var i in playerState.playersVisible){
                        var player = playerState.playersVisible[i];
                        if(player.pos.x == playerState.pos.x && player.pos.y == playerState.pos.y + 1){
                            canMove = false;
                        }
                    }
                    if(canMove) {
                        playerState.pos.y++;
                        game.global.actionQueue.push({action: {type: 'move', payload: 'S'}, target: 'self'});
                    }
                }
            }
            else if (shiftKey.isDown && playerState.readyToUpdate){
                console.log("trying to pick up");
                game.global.actionQueue.push({action: {type: 'pickup', payload: 'N/A'}, target: 'self'});
            }
        }
        else if(playerState.playerAction == 'attack'){
            if(playerState.playerTween != undefined && !playerState.playerTween.isRunning){
                playerState.playerAction = 'idle'
            }
        }
        
        if((((playerState.pos.x+1) * 32) != Math.ceil(playerSprite.x) || ((playerState.pos.y+1) * 32) != Math.ceil(playerSprite.y)) ){
            //Player is moving and we're waiting for a response from server

            playerTween = moveSprite(playerTween, playerState.pos, playerSprite);
        }
        playerSprite.play(playerState.playerAction + '-' + playerState.playerFacing);
        playerHead.frame = playerSprite.frame;
        playerRight.frame = playerSprite.frame;
        playerLeft.frame = playerSprite.frame;
    }

    //Function to handle moving the sprites, if the tween
    //  is already running simply return it so that it can
    //  complete. Otherwise, replace the old tween data with new tween
    moveSprite = function(tween, pos, sprite){
        if(tween != undefined && !tween.isRunning){
            tween = game.add.tween(sprite).to({x: ((pos.x+1)) * 32, y: (pos.y+1) * 32}, 1000, null, true);
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
        otherSprite.children[0].frame = otherSprite.frame;
        
    }

    changeEquipmentSprites = function(equipment){
        var headName = game.global.itemManager.getItemName(equipment.head);
        var torsoName = game.global.itemManager.getItemName(equipment.torso);
        var rightName = game.global.itemManager.getItemName(equipment.right);
        var leftName = game.global.itemManager.getItemName(equipment.left);
        var legsName = game.global.itemManager.getItemName(equipment.legs);
        var extraName = game.global.itemManager.getItemName(equipment.extra);

        playerRight.loadTexture(rightName + "Right", 0);
        playerImage.right.loadTexture(rightName + "Right", 0);
        playerLeft.loadTexture(leftName + "Left", 0);
        playerImage.left.loadTexture(rightName + "Left", 0);
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
        changeEquipmentSprites: changeEquipmentSprites,
        playerImage: playerImage,
    };
}