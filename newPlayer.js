var maleButton;
var femaleButton;
var chosenGender;
var playerModel;

var newPlayerState = {
    create: function(){
        var createScreen = game.add.sprite(game.world.centerX, game.world.centerY, 'createScreen');
        var cancelButton = game.add.sprite(game.world.centerX * 1.55, game.world.centerY * 1.304, 'cancelButton2');
        var confirmButton = game.add.sprite(game.world.centerX * 1.6975, game.world.centerY * 1.29, 'confirmButton2');
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

        cancelButton.events.onInputDown.add(() => game.state.start('menu'), this);
        confirmButton.events.onInputDown.add(queryCreate, this);

        maleButton = game.add.sprite(game.world.centerX * 1.0275, game.world.centerY * 0.815, 'activeRadioButton');
        femaleButton = game.add.sprite(game.world.centerX * 1.0275, game.world.centerY * 0.8725, 'inactiveRadioButton');

        maleButton.inputEnabled = true;
        femaleButton.inputEnabled = true;

        maleButton.events.onInputDown.add(function(){ changeGender(false) });
        femaleButton.events.onInputDown.add(function(){ changeGender(true) });

        chosenGender = 'm';

        playerModel = game.add.sprite(game.world.centerX * 1.075, game.world.centerY, 'player');
        playerModel.frame = 13;
    }
}

function changeGender(isFemale){
    if(isFemale){
        maleButton.loadTexture('inactiveRadioButton', 0);
        femaleButton.loadTexture('activeRadioButton', 0);
        chosenGender = 'f';
        playerModel.loadTexture('player2', 0);
        playerModel.frame = 13;
    }
    else{
        maleButton.loadTexture('activeRadioButton', 0);
        femaleButton.loadTexture('inactiveRadioButton', 0);
        chosenGender = 'm';
        playerModel.loadTexture('player', 0);
        playerModel.frame = 13;
    }
}

function queryCreate() {
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
        serverProxy.createPlayer(inputUsername.value, inputPassword.value, {gender: chosenGender});
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