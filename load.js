var loadState = {
    preload: function(){
        game.load.image('tileset', 'assets/tiles/FSORemakeMapTileset.png');
        game.load.image('menuScreen', 'assets/gui/gui_Menu.png');
        game.load.image('loadCharacterButton', 'assets/gui/gui_LoadCharacterButton.png');
        game.load.spritesheet('player', 'assets/PlayerSheet.png', 46, 45, 16);
    },

    create: function(){
        game.state.start('menu');
    }
}