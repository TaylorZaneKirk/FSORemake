var bootState = {

    create: function(){
        //Add the server client for multiplayer
        var currentTime = new Date();

        isMultiInit = false;

        game.global.ready = false;

        //game.global.player = false;

        loadTime = currentTime.getTime();

        game.physics.startSystem(Phaser.Physics.ARCADE);

        game.state.start('load');
    }
}