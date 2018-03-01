var newPlayerState = {
    create: function(){
        var createScreen = game.add.sprite(game.world.centerX, game.world.centerY, 'createScreen');
        var cancelButton = game.add.sprite(game.world.centerX * 1.075, game.world.centerY * 1.1255, 'cancelButton2');
        var confirmButton = game.add.sprite(game.world.centerX * 1.5, game.world.centerY * 1.5, 'confirmButton2');
        inputUsername = game.add.inputField(game.world.centerX * 1.435, game.world.centerY * 0.799, {
            backgroundColor: '#c0c0c0',
            width: 112.5,
            height: 20,
        });

        inputPassword = game.add.inputField(game.world.centerX * 1.435, game.world.centerY * 0.8845, {
            backgroundColor: '#c0c0c0',
            width: 112.5,
            height: 20,
        });

        createScreen.anchor.set(0.585, 0.5);
        cancelButton.anchor.set(0.5);
        confirmButton.anchor.set(0.5);

        cancelButton.inputEnabled = true;
        confirmButton.inputEnabled = true;

        cancelButton.events.onInputDown.add(listenerCancel, this);
        //confirmButton.events.onInputDown.add(listenerConfirm, this);
    }
}

function listenerCancel() {
    game.state.start('menu');
}

function listenerConfirm() {
    client = new Eureca.Client();
    /**
    * Fires on initial connection
    */
    client.onConnect(function (connection) {
        console.log('Incoming connection', connection);
        isMultiInit = true;

    });
    /**
        * When the connection is established and ready
        * we will set a local variable to the "serverProxy"
        * sent back by the server side.
        */
    client.ready(function (serverProxy) {
        // Local reference to the server proxy to be
        // used in other methods within this module.
        console.log("CLIENT READY");
        console.log(serverProxy);
        game.global.eurecaProxy = serverProxy;
        //game.state.start('main');
        serverProxy.login(inputUsername.value, inputPassword.value);
    });

    client.exports.setId = function(id){
        console.log("Setting Id:" + id);

        // Assign my new connection Id
        game.global.myId = id;

        //tell server client is ready
        //globals.eurecaProxy.initPlayer(id);
        game.state.start('main');
    }
}