var loadState = {
    preload: function(){
        game.load.image('tileset', 'assets/tiles/FSORemakeMapTileset.png');
        game.load.image('menuScreen', 'assets/gui/gui_Menu.png');
        game.load.image('loadCharacterButton', 'assets/gui/gui_LoadCharacterButton.png');
        game.load.image('newCharacterButton', 'assets/gui/gui_NewCharacterButton.png');
        game.load.image('loginScreen', 'assets/gui/gui_LoginScreen.png');
        game.load.image('cancelButton', 'assets/gui/gui_CancelButton.png');
        game.load.image('confirmButton', 'assets/gui/gui_ConfirmButton.png');
        game.load.image('cancelButton2', 'assets/gui/gui_CancelButton2.png');
        game.load.image('confirmButton2', 'assets/gui/gui_ConfirmButton2.png');
        game.load.image('createScreen', 'assets/gui/gui_CreateScreen.png');
        game.load.image('activeRadioButton', 'assets/gui/gui_ActiveRadio.png');
        game.load.image('inactiveRadioButton', 'assets/gui/gui_InactiveRadio.png');
        game.load.image('plusButton', 'assets/gui/gui_PlusButton.png');
        game.load.image('minusButton', 'assets/gui/gui_MinusButton.png');
        game.load.spritesheet('player', 'assets/PlayerSheet.png', 46, 45, 16);
    },

    create: function(){
        game.state.start('menu');
    }
}