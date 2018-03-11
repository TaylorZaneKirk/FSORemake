var maleButton;
var femaleButton;
var chosenGender;
var playerModel;
var skillBars = {
    strength:{
        strengthBar: null,
        strengthBarObject: null
    },
    dexterity:{
        dexterityBar: null,
        dexterityBarObject: null
    },
    endurance:{
        enduranceBar: null,
        enduranceBarObject: null,
    },
    agility:{
        agilityBar: null,
        agilityBarObject: null
    },
    arcane:{
        arcaneBar: null,
        arcaneBarObject: null
    },
    luck:{
        luckBar: null,
        luckBarObject: null
    }
};

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

        maleButton.events.onInputDown.add(function(){ changeGender(false); });
        femaleButton.events.onInputDown.add(function(){ changeGender(true); });

        var strengthMinusButton = game.add.sprite(game.world.centerX * 0.275, game.world.centerY * 0.8125, 'minusButton');
        var dexterityMinusButton = game.add.sprite(game.world.centerX * 0.275, game.world.centerY * 0.8875, 'minusButton');
        var enduranceMinusButton = game.add.sprite(game.world.centerX * 0.275, game.world.centerY * 0.955, 'minusButton');
        var agilityMinusButton = game.add.sprite(game.world.centerX * 0.275, game.world.centerY * 1.025, 'minusButton');
        var arcaneMinusButton = game.add.sprite(game.world.centerX * 0.275, game.world.centerY * 1.1, 'minusButton');
        var luckMinusButton = game.add.sprite(game.world.centerX * 0.275, game.world.centerY * 1.175, 'minusButton');
        var strengthPlusButton = game.add.sprite(game.world.centerX * 0.68, game.world.centerY * 0.8125, 'plusButton');
        var dexterityPlusButton = game.add.sprite(game.world.centerX * 0.68, game.world.centerY * 0.8875, 'plusButton');
        var endurancePlusButton = game.add.sprite(game.world.centerX * 0.68, game.world.centerY * 0.955, 'plusButton');
        var agilityPlusButton = game.add.sprite(game.world.centerX * 0.68, game.world.centerY * 1.025, 'plusButton');
        var arcanePlusButton = game.add.sprite(game.world.centerX * 0.68, game.world.centerY * 1.1, 'plusButton');
        var luckPlusButton = game.add.sprite(game.world.centerX * 0.68, game.world.centerY * 1.175, 'plusButton');

        skillBars.strength.strengthBar = {
            pos: {
                x: game.world.centerX * 0.32,
                y: game.world.centerY * 0.8125
            },
            size: {
                w: 138,
                h: 13,
                _1p: 0 /// will be calculated later
            },
            fill_c: 0x0000ff,
            border_c: 0x000099,
            alpha: 0.7
        };
        skillBars.strength.strengthBar.size._1p = skillBars.strength.strengthBar.size.w * 0.01; ///// 1% of width ///
        skillBars.strength.strengthBarObject = game.add.graphics( skillBars.strength.strengthBar.pos.x, skillBars.strength.strengthBar.pos.y );
        updateStrengthBar(100);

        skillBars.dexterity.dexterityBar = {
            pos: {
                x: game.world.centerX * 0.32,
                y: game.world.centerY * 0.8875
            },
            size: {
                w: 138,
                h: 13,
                _1p: 0 /// will be calculated later
            },
            fill_c: 0x0000ff,
            border_c: 0x000099,
            alpha: 0.7
        };
        skillBars.dexterity.dexterityBar.size._1p = skillBars.dexterity.dexterityBar.size.w * 0.01; ///// 1% of width ///
        skillBars.dexterity.dexterityBarObject = game.add.graphics( skillBars.dexterity.dexterityBar.pos.x, skillBars.dexterity.dexterityBar.pos.y );
        updateDexterityBar(100);

        chosenGender = 'm';

        playerModel = game.add.sprite(game.world.centerX * 1.07, game.world.centerY, 'player');
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

updateStrengthBar = function( strengthPercentage ){ //// strength percentage 
	skillBars.strength.strengthBarObject.clear();
	skillBars.strength.strengthBarObject.lineStyle( 2, skillBars.strength.strengthBar.border_c, skillBars.strength.strengthBar.alpha );
	skillBars.strength.strengthBarObject.beginFill( skillBars.strength.strengthBar.fill_c, skillBars.strength.strengthBar.alpha );
	skillBars.strength.strengthBarObject.drawRect( 0, 0, strengthPercentage * skillBars.strength.strengthBar.size._1p , skillBars.strength.strengthBar.size.h );
	skillBars.strength.strengthBarObject.endFill();
}

updateDexterityBar = function( dexterityPercentage ){ //// dexterity percentage 
	skillBars.dexterity.dexterityBarObject.clear();
	skillBars.dexterity.dexterityBarObject.lineStyle( 2, skillBars.dexterity.dexterityBar.border_c, skillBars.dexterity.dexterityBar.alpha );
	skillBars.dexterity.dexterityBarObject.beginFill( skillBars.dexterity.dexterityBar.fill_c, skillBars.dexterity.dexterityBar.alpha );
	skillBars.dexterity.dexterityBarObject.drawRect( 0, 0, dexterityPercentage * skillBars.dexterity.dexterityBar.size._1p , skillBars.dexterity.dexterityBar.size.h );
	skillBars.dexterity.dexterityBarObject.endFill();
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