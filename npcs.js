var NPCObject = NPCObject || {};

var NPCObject = function(idRef, gameRef){
    var game = null; //Reference to game object
    var idLocal = null; //Local npc's id
    var npcState = null; //npc's current state
    var npcSprite = null;
    var npcHead = null;
    var npcRight = null;
    var npcLeft = null;
    var currentAction = null;
    var npcTween = null;
    var npcName = null;

    function init(idRef, gameRef){
        game = gameRef;
        idLocal = idRef;
        npcState = game.global.npcList[idLocal].npc;

        if(npcState.isHuman){
            var equipTorsoName = game.global.itemManager.getItemName(npcState.equipTorso);
            if(equipTorsoName == 'NOTHING'){
                npcSprite = game.add.sprite((npcState.pos.x+1)*32, (npcState.pos.y+1)*32, 'defaultBody');
            }
            else{
                npcSprite = game.add.sprite((npcState.pos.x+1)*32, (npcState.pos.y+1)*32, equipTorsoName + "Torso");
            }

            var equipHeadName = game.global.itemManager.getItemName(npcState.equipHead);
            if(equipHeadName == 'NOTHING'){
                if(npcState.gender == 'm'){
                    npcHead = game.add.sprite(-6.5, -7, 'maleHead' + npcState.headType);
                }
                else{
                    npcHead = game.add.sprite(-6.5, -7, 'femaleHead' + npcState.headType);
                } 
            }
            else{
                npcHead = game.add.sprite(-6.5, -7, equipHeadName + "Head");
            }
            npcSprite.addChild(npcHead);

            var equipRightName = game.global.itemManager.getItemName(npcState.equipRight);
            npcRight = game.add.sprite(17, 17, equipRightName + "Right");
            npcRight.anchor.setTo(0.5);
            npcSprite.addChild(npcRight);

            var equipLeftName = game.global.itemManager.getItemName(npcState.equipLeft);
            npcLeft = game.add.sprite(17, 17, equipLeftName + "Left");
            npcLeft.anchor.setTo(0.5);
            npcSprite.addChild(npcLeft);

            npcSprite.anchor.setTo(0.1430,0.15);

            npcSprite.animations.add('walk-E', [0,1,2], 6, true);
            npcSprite.animations.add('walk-W', [4,5,6], 6, true);
            npcSprite.animations.add('walk-N', [8,9,10], 6, true);
            npcSprite.animations.add('walk-S', [12,13,14], 6, true);
            npcSprite.animations.add('attack-E', [1,3,1], 3, false);
            npcSprite.animations.add('attack-W', [5,7,5], 3, false);
            npcSprite.animations.add('attack-N', [9,11,9], 3, false);
            npcSprite.animations.add('attack-S', [13,15,13], 3, false);
            npcSprite.animations.add('idle-E', [1], 1, false);
            npcSprite.animations.add('idle-W', [5], 1, false);
            npcSprite.animations.add('idle-N', [9], 1, false);
            npcSprite.animations.add('idle-S', [13], 1, false);
            npcSprite.play('idle-' + npcState.npcFacing);

            npcHead.animations.add('walk-E', [0,1,2], 6, true);
            npcHead.animations.add('walk-W', [4,5,6], 6, true);
            npcHead.animations.add('walk-N', [8,9,10], 6, true);
            npcHead.animations.add('walk-S', [12,13,14], 6, true);
            npcHead.animations.add('attack-E', [1,3,1], 3, false);
            npcHead.animations.add('attack-W', [5,7,5], 3, false);
            npcHead.animations.add('attack-N', [9,11,9], 3, false);
            npcHead.animations.add('attack-S', [13,15,13], 3, false);
            npcHead.animations.add('idle-E', [1], 1, false);
            npcHead.animations.add('idle-W', [5], 1, false);
            npcHead.animations.add('idle-N', [9], 1, false);
            npcHead.animations.add('idle-S', [13], 1, false);
            npcHead.frame = npcSprite.frame;

            npcRight.animations.add('walk-E', [0,1,2], 6, true);
            npcRight.animations.add('walk-W', [4,5,6], 6, true);
            npcRight.animations.add('walk-N', [8,9,10], 6, true);
            npcRight.animations.add('walk-S', [12,13,14], 6, true);
            npcRight.animations.add('attack-E', [1,3,1], 3, false);
            npcRight.animations.add('attack-W', [5,7,5], 3, false);
            npcRight.animations.add('attack-N', [9,11,9], 3, false);
            npcRight.animations.add('attack-S', [13,15,13], 3, false);
            npcRight.animations.add('idle-E', [1], 1, false);
            npcRight.animations.add('idle-W', [5], 1, false);
            npcRight.animations.add('idle-N', [9], 1, false);
            npcRight.animations.add('idle-S', [13], 1, false);
            npcRight.frame = npcSprite.frame;

            npcLeft.animations.add('walk-E', [0,1,2], 6, true);
            npcLeft.animations.add('walk-W', [4,5,6], 6, true);
            npcLeft.animations.add('walk-N', [8,9,10], 6, true);
            npcLeft.animations.add('walk-S', [12,13,14], 6, true);
            npcLeft.animations.add('attack-E', [1,3,1], 3, false);
            npcLeft.animations.add('attack-W', [5,7,5], 3, false);
            npcLeft.animations.add('attack-N', [9,11,9], 3, false);
            npcLeft.animations.add('attack-S', [13,15,13], 3, false);
            npcLeft.animations.add('idle-E', [1], 1, false);
            npcLeft.animations.add('idle-W', [5], 1, false);
            npcLeft.animations.add('idle-N', [9], 1, false);
            npcLeft.animations.add('idle-S', [13], 1, false);
            npcLeft.frame = npcSprite.frame;
        }
        else{
            npcSprite = game.add.sprite((npcState.pos.x+1)*32, (npcState.pos.y+1)*32, npcState.npcName);
            //npcSprite.anchor.setTo(0.5);
            npcSprite.animations.add('walk-E', [0,1,2], 6, true);
            npcSprite.animations.add('walk-W', [4,5,6], 6, true);
            npcSprite.animations.add('walk-N', [8,9,10], 6, true);
            npcSprite.animations.add('walk-S', [12,13,14], 6, true);
            npcSprite.animations.add('attack-E', [1,3,1], 3, false);
            npcSprite.animations.add('attack-W', [5,7,5], 3, false);
            npcSprite.animations.add('attack-N', [9,11,9], 3, false);
            npcSprite.animations.add('attack-S', [13,15,13], 3, false);
            npcSprite.animations.add('idle-E', [1], 1, false);
            npcSprite.animations.add('idle-W', [5], 1, false);
            npcSprite.animations.add('idle-N', [9], 1, false);
            npcSprite.animations.add('idle-S', [13], 1, false);
            npcSprite.play('idle-' + npcState.npcFacing);
        }

        npcSprite.inputEnabled = true;
        npcName = game.add.text(15, -10, '[NPC] ' + npcState.npcName + ' Lv.' + npcState.level, { font: "14px Ariel", fill: '#ffffff'});
        npcName.alpha = 0;
        npcSprite.events.onInputOver.add(showNPCName, this);
        npcSprite.events.onInputOut.add(hideNPCName, this);
        npcName.anchor.setTo(0.5);
        npcSprite.addChild(npcName);

        npcTween = game.add.tween(npcSprite);
        game.global.playerLayer.add(npcSprite);
        console.log(npcSprite.children);
        game.global.textLayer.add(npcSprite.children[3]);
    }

    function showNPCName(state){
        console.log("show name");
        npcName.alpha = 1;
    }

    function hideNPCName(state){
        npcName.alpha = 0;
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

    moveNPC = function(id){
        //Get references
        var thisNPC = game.global.npcList[id].npc;
        var thisSprite = game.global.npcList[id].npcObject.npcSprite;
        var thisTween = game.global.npcList[id].npcObject.npcTween;

        if(thisNPC.npcAction == 'walk'){
            //server told us the player is moving
            thisTween = moveSprite(thisTween, thisNPC.pos, thisSprite);
        }
        else if(((thisNPC.pos.x+1) * 32) != Math.ceil(thisSprite.x) || ((thisNPC.pos.y+1) * 32) != Math.ceil(thisSprite.y)){
            //Server says the player is idle, put their coordinates don't match ours,
            //  so we'll "infer" the movement locally
            thisNPC.npcAction = "walk";
            thisTween = moveSprite(thisTween, thisNPC.pos, thisSprite);
        }

        //Set references
        game.global.npcList[id].npcObject.npcSprite = thisSprite;
        game.global.npcList[id].npcObject.npcTween = thisTween;
        thisSprite.play(thisNPC.npcAction + '-' + thisNPC.npcFacing);

        if(thisNPC.isHuman){
            var thisHead = thisSprite.children[0];
            var thisRight = thisSprite.children[1];
            var thisLeft = thisSprite.children[2];

            //otherSprite.children[0].frame = otherSprite.frame;
            thisHead.frame = thisSprite.frame;
            thisRight.frame = thisSprite.frame;
            thisLeft.frame = thisSprite.frame;
        }
    }

    init(idRef, gameRef);
    
    return {
        game: game,
        id: idLocal,
        npcState: npcState,
        npcSprite: npcSprite,
        npcTween: npcTween,
        moveNPC: moveNPC
    };
}