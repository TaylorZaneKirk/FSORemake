var PlayerObject = PlayerObject || {};

class PlayerObject{
    game = null; //Reference to game object
    id = null; //Local player's id
    playerState = null; //player's current state
    constructor(id, game){
        this.game = game;
        this.id = id;
        this.playerState = game.global.player;
    }
}