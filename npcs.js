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
    }
}