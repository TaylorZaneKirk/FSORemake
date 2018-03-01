
var inputUsername;
var inputPassword

var loadPlayerState = {
    
    create: function(){
        var loginScreen = game.add.sprite(game.world.centerX, game.world.centerY, 'loginScreen');
        var cancelButton = game.add.sprite(game.world.centerX * 1.075, game.world.centerY * 1.1255, 'cancelButton');
        var confirmButton = game.add.sprite(game.world.centerX * 1.22225, game.world.centerY * 1.125, 'confirmButton');
        inputUsername = game.add.inputField(game.world.centerX * 0.9725, game.world.centerY * 0.87225, {
            backgroundColor: '#c0c0c0',
            width: 112.5,
            height: 20,
        });

        inputPassword = game.add.inputField(game.world.centerX * 0.9725, game.world.centerY * 0.955, {
            backgroundColor: '#c0c0c0',
            width: 112.5,
            height: 20,
        });

        loginScreen.anchor.set(0.5);
        cancelButton.anchor.set(0.5);
        confirmButton.anchor.set(0.5);

        cancelButton.inputEnabled = true;
        confirmButton.inputEnabled = true;

        cancelButton.events.onInputDown.add(() => game.state.start('menu'), this);
        confirmButton.events.onInputDown.add(queryLogin, this);
    }
}
/* 
function listenerCancel() {
    game.state.start('menu');
} */

function queryLogin() {
    if(inputUsername.value == undefined || inputPassword.value == undefined){
        return;
    }
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

    client.exports.errorAndDisconnect = function(err){
        alert(err);
        client.disconnect();
        isMultiInit = false;
        game.global.eurecaProxy = null;
        game.state.restart();
    }
    
}