var loadState = {
    preload: function(){
        game.load.image('tileset', 'assets/tiles/FSORemakeMapTileset.png');
        game.load.image('menuScreen', 'assets/gui/gui_Menu.png');
        game.load.image('loadCharacterButton', 'assets/gui/gui_LoadCharacterButton.png');
        game.load.image('loginScreen', 'assets/gui/gui_LoginScreen.png');
        game.load.image('cancelButton', 'assets/gui/gui_CancelButton.png');
        game.load.image('confirmButton', 'assets/gui/gui_ConfirmButton.png');
        game.load.spritesheet('player', 'assets/PlayerSheet.png', 46, 45, 16);
    },

    create: function(){
        game.state.start('menu');
    }
}