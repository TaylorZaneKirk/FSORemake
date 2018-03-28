var maleButton;
var femaleButton;
var warriorButton;
var archerButton;
var mageButton;
var chosenClass;
var chosenGender;
var playerModel;
var playerHead;
var skillBars = {
    strength:{
        strengthBar: null,
        strengthBarObject: null,
        strengthBarText: null,
        strengthBarTextBonus: null,
    },
    dexterity:{
        dexterityBar: null,
        dexterityBarObject: null,
        dexterityBarText: null,
        dexterityBarTextBonus: null,
    },
    endurance:{
        enduranceBar: null,
        enduranceBarObject: null,
        enduranceBarText: null,
        enduranceBarTextBonus: null,
    },
    agility:{
        agilityBar: null,
        agilityBarObject: null,
        agilityBarText: null,
        agilityBarTextBonus: null,
    },
    arcane:{
        arcaneBar: null,
        arcaneBarObject: null,
        arcaneBarText: null,
        arcaneBarTextBonus: null,
    },
    luck:{
        luckBar: null,
        luckBarObject: null,
        luckBarText: null,
        luckBarTextBonus: null,
    }
};

var chosenStrength = 1;
var chosenDexterity = 1;
var chosenEndurance = 1;
var chosenAgility = 1;
var chosenArcane = 1;
var chosenLuck = 1;
var chosenHead = 1;
var availablePoints = 50;
var availablePointsText;
var leftArrow = null;
var rightArrow = null;

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
        warriorButton = game.add.sprite(game.world.centerX * 1.285, game.world.centerY * 1.06, 'activeRadioButton');
        archerButton = game.add.sprite(game.world.centerX * 1.285, game.world.centerY * 1.1075, 'inactiveRadioButton');
        mageButton = game.add.sprite(game.world.centerX * 1.285, game.world.centerY * 1.156, 'inactiveRadioButton');

        warriorButton.addChild(game.make.text( 15 , -2, "Warrior", { font: "bold 12px Arial", fill: "#000",  boundsAlignH: "center", boundsAlignV: "middle" } ));
        archerButton.addChild(game.make.text( 15 , -2, "Archer", { font: "bold 12px Arial", fill: "#000",  boundsAlignH: "center", boundsAlignV: "middle" } ));
        mageButton.addChild(game.make.text( 15 , -2, "Mage", { font: "bold 12px Arial", fill: "#000",  boundsAlignH: "center", boundsAlignV: "middle" } ));

        maleButton.inputEnabled = true;
        femaleButton.inputEnabled = true;
        warriorButton.inputEnabled = true;
        archerButton.inputEnabled = true;
        mageButton.inputEnabled = true;

        maleButton.events.onInputDown.add(function(){ changeGender(false); });
        femaleButton.events.onInputDown.add(function(){ changeGender(true); });
        warriorButton.events.onInputDown.add(function(){ changeClass(0); });
        archerButton.events.onInputDown.add(function(){ changeClass(1); });
        mageButton.events.onInputDown.add(function(){ changeClass(2); });

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
        strengthMinusButton.inputEnabled = true;
        strengthMinusButton.events.onInputDown.add(function(){ if(availablePoints < 51 && chosenStrength > 1) { availablePoints++; updateStrengthBar(--chosenStrength); } });
        dexterityMinusButton.inputEnabled = true;
        dexterityMinusButton.events.onInputDown.add(function(){ if(availablePoints < 51 && chosenDexterity > 1) { availablePoints++; updateDexterityBar(--chosenDexterity); } });
        enduranceMinusButton.inputEnabled = true;
        enduranceMinusButton.events.onInputDown.add(function(){ if(availablePoints < 51 && chosenEndurance > 1) { availablePoints++; updateEnduranceBar(--chosenEndurance); } });
        agilityMinusButton.inputEnabled = true;
        agilityMinusButton.events.onInputDown.add(function(){ if(availablePoints < 51 && chosenAgility > 1) { availablePoints++; updateAgilityBar(--chosenAgility); } });
        arcaneMinusButton.inputEnabled = true;
        arcaneMinusButton.events.onInputDown.add(function(){ if(availablePoints < 51 && chosenArcane > 1) { availablePoints++; updateArcaneBar(--chosenArcane); } });
        luckMinusButton.inputEnabled = true;
        luckMinusButton.events.onInputDown.add(function(){ if(availablePoints < 51 && chosenLuck > 1) { availablePoints++; updateLuckBar(--chosenLuck); } });
        strengthPlusButton.inputEnabled = true;
        strengthPlusButton.events.onInputDown.add(function(){ if(availablePoints > 0 && chosenStrength < 51) { availablePoints--; updateStrengthBar(++chosenStrength); } });
        dexterityPlusButton.inputEnabled = true;
        dexterityPlusButton.events.onInputDown.add(function(){ if(availablePoints > 0 && chosenDexterity < 51) { availablePoints--; updateDexterityBar(++chosenDexterity); } });
        endurancePlusButton.inputEnabled = true;
        endurancePlusButton.events.onInputDown.add(function(){ if(availablePoints > 0 && chosenEndurance < 51) { availablePoints--; updateEnduranceBar(++chosenEndurance); } });
        agilityPlusButton.inputEnabled = true;
        agilityPlusButton.events.onInputDown.add(function(){ if(availablePoints > 0 && chosenAgility < 51) { availablePoints--; updateAgilityBar(++chosenAgility); } });
        arcanePlusButton.inputEnabled = true;
        arcanePlusButton.events.onInputDown.add(function(){ if(availablePoints > 0 && chosenArcane < 51) { availablePoints--; updateArcaneBar(++chosenArcane); } });
        luckPlusButton.inputEnabled = true;
        luckPlusButton.events.onInputDown.add(function(){ if(availablePoints > 0 && chosenLuck < 51) { availablePoints--; updateLuckBar(++chosenLuck); } });

        availablePointsText = game.add.text( game.world.centerX * 0.32, game.world.centerY * 1.255, "Available Points Remaining: " + availablePoints, { font: "bold 14px Arial", fill: "#FFF",  boundsAlignH: "center", boundsAlignV: "middle" } );

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
        skillBars.strength.strengthBarText = game.make.text( 0 , 0, "", { font: "bold 10px Arial", fill: "#FFF",  boundsAlignH: "center", boundsAlignV: "middle" } );
        skillBars.strength.strengthBarTextBonus = game.make.text( 7 , 0, " + 5", { font: "bold 10px Arial", fill: "#00ff00",  boundsAlignH: "center", boundsAlignV: "middle" } );
        skillBars.strength.strengthBarText.setTextBounds(0, 2, skillBars.strength.strengthBar.size.w, skillBars.strength.strengthBar.size.h);
        skillBars.strength.strengthBarObject.addChild(skillBars.strength.strengthBarText);
        skillBars.strength.strengthBarText.addChild(skillBars.strength.strengthBarTextBonus);
        updateStrengthBar(1);

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
        skillBars.dexterity.dexterityBarText = game.make.text( 0 , 0, "", { font: "bold 10px Arial", fill: "#FFF",  boundsAlignH: "center", boundsAlignV: "middle" } );
        skillBars.dexterity.dexterityBarTextBonus = game.make.text( 7 , 0, " + 0", { font: "bold 10px Arial", fill: "#00ff00",  boundsAlignH: "center", boundsAlignV: "middle" } );
        skillBars.dexterity.dexterityBarText.setTextBounds(0, 2, skillBars.dexterity.dexterityBar.size.w, skillBars.dexterity.dexterityBar.size.h);
        skillBars.dexterity.dexterityBarObject.addChild(skillBars.dexterity.dexterityBarText);
        skillBars.dexterity.dexterityBarText.addChild(skillBars.dexterity.dexterityBarTextBonus);
        updateDexterityBar(1);

        skillBars.endurance.enduranceBar = {
            pos: {
                x: game.world.centerX * 0.32,
                y: game.world.centerY * 0.955
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
        skillBars.endurance.enduranceBar.size._1p = skillBars.endurance.enduranceBar.size.w * 0.01; ///// 1% of width ///
        skillBars.endurance.enduranceBarObject = game.add.graphics( skillBars.endurance.enduranceBar.pos.x, skillBars.endurance.enduranceBar.pos.y );
        skillBars.endurance.enduranceBarText = game.make.text( 0 , 0, "", { font: "bold 10px Arial", fill: "#FFF",  boundsAlignH: "center", boundsAlignV: "middle" } );
        skillBars.endurance.enduranceBarTextBonus = game.make.text( 7 , 0, " + 0", { font: "bold 10px Arial", fill: "#00ff00",  boundsAlignH: "center", boundsAlignV: "middle" } );
        skillBars.endurance.enduranceBarText.setTextBounds(0, 2, skillBars.endurance.enduranceBar.size.w, skillBars.endurance.enduranceBar.size.h);
        skillBars.endurance.enduranceBarObject.addChild(skillBars.endurance.enduranceBarText);
        skillBars.endurance.enduranceBarText.addChild(skillBars.endurance.enduranceBarTextBonus);
        updateEnduranceBar(1);

        skillBars.agility.agilityBar = {
            pos: {
                x: game.world.centerX * 0.32,
                y: game.world.centerY * 1.025
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
        skillBars.agility.agilityBar.size._1p = skillBars.agility.agilityBar.size.w * 0.01; ///// 1% of width ///
        skillBars.agility.agilityBarObject = game.add.graphics( skillBars.agility.agilityBar.pos.x, skillBars.agility.agilityBar.pos.y );
        skillBars.agility.agilityBarText = game.make.text( 0 , 0, "", { font: "bold 10px Arial", fill: "#FFF",  boundsAlignH: "center", boundsAlignV: "middle" } );
        skillBars.agility.agilityBarTextBonus = game.make.text( 7 , 0, " + 0", { font: "bold 10px Arial", fill: "#00ff00",  boundsAlignH: "center", boundsAlignV: "middle" } );
        skillBars.agility.agilityBarText.setTextBounds(0, 2, skillBars.agility.agilityBar.size.w, skillBars.agility.agilityBar.size.h);
        skillBars.agility.agilityBarObject.addChild(skillBars.agility.agilityBarText);
        skillBars.agility.agilityBarText.addChild(skillBars.agility.agilityBarTextBonus);
        updateAgilityBar(1);

        skillBars.arcane.arcaneBar = {
            pos: {
                x: game.world.centerX * 0.32,
                y: game.world.centerY * 1.095
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
        skillBars.arcane.arcaneBar.size._1p = skillBars.arcane.arcaneBar.size.w * 0.01; ///// 1% of width ///
        skillBars.arcane.arcaneBarObject = game.add.graphics( skillBars.arcane.arcaneBar.pos.x, skillBars.arcane.arcaneBar.pos.y );
        skillBars.arcane.arcaneBarText = game.make.text( 0 , 0, "", { font: "bold 10px Arial", fill: "#FFF",  boundsAlignH: "center", boundsAlignV: "middle" } );
        skillBars.arcane.arcaneBarTextBonus = game.make.text( 7 , 0, " + 0", { font: "bold 10px Arial", fill: "#00ff00",  boundsAlignH: "center", boundsAlignV: "middle" } );
        skillBars.arcane.arcaneBarText.setTextBounds(0, 2, skillBars.arcane.arcaneBar.size.w, skillBars.arcane.arcaneBar.size.h);
        skillBars.arcane.arcaneBarObject.addChild(skillBars.arcane.arcaneBarText);
        skillBars.arcane.arcaneBarText.addChild(skillBars.arcane.arcaneBarTextBonus);
        updateArcaneBar(1);

        skillBars.luck.luckBar = {
            pos: {
                x: game.world.centerX * 0.32,
                y: game.world.centerY * 1.169
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
        skillBars.luck.luckBar.size._1p = skillBars.luck.luckBar.size.w * 0.01; ///// 1% of width ///
        skillBars.luck.luckBarObject = game.add.graphics( skillBars.luck.luckBar.pos.x, skillBars.luck.luckBar.pos.y );
        skillBars.luck.luckBarText = game.make.text( 0 , 0, "", { font: "bold 10px Arial", fill: "#FFF",  boundsAlignH: "center", boundsAlignV: "middle" } );
        skillBars.luck.luckBarTextBonus = game.make.text( 7 , 0, " + 0", { font: "bold 10px Arial", fill: "#00ff00",  boundsAlignH: "center", boundsAlignV: "middle" } );
        skillBars.luck.luckBarText.setTextBounds(0, 2, skillBars.luck.luckBar.size.w, skillBars.luck.luckBar.size.h);
        skillBars.luck.luckBarObject.addChild(skillBars.luck.luckBarText);
        skillBars.luck.luckBarText.addChild(skillBars.luck.luckBarTextBonus);
        updateLuckBar(1);

        chosenGender = 'm';

        playerModel = game.add.sprite(game.world.centerX * 1.07, game.world.centerY, 'defaultBody');
        playerHead = game.add.sprite(0, 0, 'maleHead' + chosenHead);
        playerModel.addChild(playerHead);
        playerModel.frame = 13;
        playerHead.frame = 13;

        leftArrow = game.add.sprite(game.world.centerX * 1.055, game.world.centerY * 1.1475, 'leftArrow');
        leftArrow.inputEnabled = true;
        leftArrow.events.onInputDown.add(function(){ prevHeadOption(); });
        rightArrow = game.add.sprite(game.world.centerX * 1.125, game.world.centerY * 1.1475, 'rightArrow');
        rightArrow.inputEnabled = true;
        rightArrow.events.onInputDown.add(function(){ nextHeadOption(); });
    }
}

function nextHeadOption(){
    chosenHead += 1;
    if(chosenHead = 4){
        chosenHead = 1;
    }
    if(chosenGender == 'f'){
        playerHead.loadTexture('femaleHead' + chosenHead, 0);
        playerHead.frame = 13;
    }
    else{
        playerHead.loadTexture('maleHead' + chosenHead, 0);
        playerHead.frame = 13;
    }
}

function prevHeadOption(){
    chosenHead -= 1;
    if(chosenHead = 0){
        chosenHead = 3;
    }
    if(chosenGender == 'f'){
        playerHead.loadTexture('femaleHead' + chosenHead, 0);
        playerHead.frame = 13;
    }
    else{
        playerHead.loadTexture('maleHead' + chosenHead, 0);
        playerHead.frame = 13;
    }
}

function changeGender(isFemale){
    if(isFemale){
        maleButton.loadTexture('inactiveRadioButton', 0);
        femaleButton.loadTexture('activeRadioButton', 0);
        chosenGender = 'f';
        playerHead.loadTexture('femaleHead' + chosenHead, 0);
        playerHead.frame = 13;
    }
    else{
        maleButton.loadTexture('activeRadioButton', 0);
        femaleButton.loadTexture('inactiveRadioButton', 0);
        chosenGender = 'm';
        playerHead.loadTexture('maleHead' + chosenHead, 0);
        playerHead.frame = 13;
    }
}

function changeClass(index){
    if(index == 0){
        warriorButton.loadTexture('activeRadioButton', 0);
        archerButton.loadTexture('inactiveRadioButton', 0);
        mageButton.loadTexture('inactiveRadioButton', 0);
        skillBars.strength.strengthBarTextBonus.setText( " + 5" );
        skillBars.dexterity.dexterityBarTextBonus.setText( " + 0" );
        skillBars.arcane.arcaneBarTextBonus.setText( " + 0" );
        chosenClass = 'warrior';
    }
    else if(index == 1){
        warriorButton.loadTexture('inactiveRadioButton', 0);
        archerButton.loadTexture('activeRadioButton', 0);
        mageButton.loadTexture('inactiveRadioButton', 0);
        skillBars.strength.strengthBarTextBonus.setText( " + 0" );
        skillBars.dexterity.dexterityBarTextBonus.setText( " + 5" );
        skillBars.arcane.arcaneBarTextBonus.setText( " + 0" );
        chosenClass = 'archer';
    }
    else{
        warriorButton.loadTexture('inactiveRadioButton', 0);
        archerButton.loadTexture('inactiveRadioButton', 0);
        mageButton.loadTexture('activeRadioButton', 0);
        skillBars.strength.strengthBarTextBonus.setText( " + 0" );
        skillBars.dexterity.dexterityBarTextBonus.setText( " + 0" );
        skillBars.arcane.arcaneBarTextBonus.setText( " + 5" );
        chosenClass = 'mage';
    }
}

updateStrengthBar = function( strengthPercentage ){ //// strength percentage
	skillBars.strength.strengthBarObject.clear();
    skillBars.strength.strengthBarObject.lineStyle( 2, skillBars.strength.strengthBar.border_c, skillBars.strength.strengthBar.alpha );
    skillBars.strength.strengthBarText.setText( strengthPercentage );
    availablePointsText.setText( "Available Points Remaining:" + availablePoints );
	skillBars.strength.strengthBarObject.beginFill( skillBars.strength.strengthBar.fill_c, skillBars.strength.strengthBar.alpha );
	skillBars.strength.strengthBarObject.drawRect( 0, 0, strengthPercentage * skillBars.strength.strengthBar.size._1p , skillBars.strength.strengthBar.size.h );
	skillBars.strength.strengthBarObject.endFill();
}

updateDexterityBar = function( dexterityPercentage ){ //// dexterity percentage 
	skillBars.dexterity.dexterityBarObject.clear();
    skillBars.dexterity.dexterityBarObject.lineStyle( 2, skillBars.dexterity.dexterityBar.border_c, skillBars.dexterity.dexterityBar.alpha );
    skillBars.dexterity.dexterityBarText.setText( dexterityPercentage );
    availablePointsText.setText( "Available Points Remaining:" + availablePoints );
	skillBars.dexterity.dexterityBarObject.beginFill( skillBars.dexterity.dexterityBar.fill_c, skillBars.dexterity.dexterityBar.alpha );
	skillBars.dexterity.dexterityBarObject.drawRect( 0, 0, dexterityPercentage * skillBars.dexterity.dexterityBar.size._1p , skillBars.dexterity.dexterityBar.size.h );
	skillBars.dexterity.dexterityBarObject.endFill();
}

updateEnduranceBar = function( endurancePercentage ){ //// endurance percentage 
	skillBars.endurance.enduranceBarObject.clear();
    skillBars.endurance.enduranceBarObject.lineStyle( 2, skillBars.endurance.enduranceBar.border_c, skillBars.endurance.enduranceBar.alpha );
    skillBars.endurance.enduranceBarText.setText( endurancePercentage );
    availablePointsText.setText( "Available Points Remaining:" + availablePoints );
	skillBars.endurance.enduranceBarObject.beginFill( skillBars.endurance.enduranceBar.fill_c, skillBars.endurance.enduranceBar.alpha );
	skillBars.endurance.enduranceBarObject.drawRect( 0, 0, endurancePercentage * skillBars.endurance.enduranceBar.size._1p , skillBars.endurance.enduranceBar.size.h );
	skillBars.endurance.enduranceBarObject.endFill();
}

updateAgilityBar = function( agilityPercentage ){ //// agility percentage 
	skillBars.agility.agilityBarObject.clear();
    skillBars.agility.agilityBarObject.lineStyle( 2, skillBars.agility.agilityBar.border_c, skillBars.agility.agilityBar.alpha );
    skillBars.agility.agilityBarText.setText( agilityPercentage );
    availablePointsText.setText( "Available Points Remaining:" + availablePoints );
	skillBars.agility.agilityBarObject.beginFill( skillBars.agility.agilityBar.fill_c, skillBars.agility.agilityBar.alpha );
	skillBars.agility.agilityBarObject.drawRect( 0, 0, agilityPercentage * skillBars.agility.agilityBar.size._1p , skillBars.agility.agilityBar.size.h );
	skillBars.agility.agilityBarObject.endFill();
}

updateArcaneBar = function( arcanePercentage ){ //// arcane percentage 
	skillBars.arcane.arcaneBarObject.clear();
    skillBars.arcane.arcaneBarObject.lineStyle( 2, skillBars.arcane.arcaneBar.border_c, skillBars.arcane.arcaneBar.alpha );
    skillBars.arcane.arcaneBarText.setText( arcanePercentage );
    availablePointsText.setText( "Available Points Remaining:" + availablePoints );
	skillBars.arcane.arcaneBarObject.beginFill( skillBars.arcane.arcaneBar.fill_c, skillBars.arcane.arcaneBar.alpha );
	skillBars.arcane.arcaneBarObject.drawRect( 0, 0, arcanePercentage * skillBars.arcane.arcaneBar.size._1p , skillBars.arcane.arcaneBar.size.h );
	skillBars.arcane.arcaneBarObject.endFill();
}

updateLuckBar = function( luckPercentage ){ //// luck percentage 
	skillBars.luck.luckBarObject.clear();
    skillBars.luck.luckBarObject.lineStyle( 2, skillBars.luck.luckBar.border_c, skillBars.luck.luckBar.alpha );
    skillBars.luck.luckBarText.setText( luckPercentage );
    availablePointsText.setText( "Available Points Remaining:" + availablePoints );
	skillBars.luck.luckBarObject.beginFill( skillBars.luck.luckBar.fill_c, skillBars.luck.luckBar.alpha );
	skillBars.luck.luckBarObject.drawRect( 0, 0, luckPercentage * skillBars.luck.luckBar.size._1p , skillBars.luck.luckBar.size.h );
	skillBars.luck.luckBarObject.endFill();
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
        serverProxy.createPlayer(inputUsername.value, inputPassword.value, {gender: chosenGender, class: chosenClass, headType: chosenHead, strength: chosenStrength, dexterity: chosenDexterity, endurance: chosenEndurance, agility: chosenAgility, arcane: chosenArcane, luck: chosenLuck});
    });

    client.exports.setId = function(id, itemData){
        console.log("Setting Id:" + id);

        // Assign my new connection Id
        game.global.myId = id;
        game.global.itemManager = new itemManager(itemData);
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