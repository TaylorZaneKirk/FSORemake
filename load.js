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
        game.load.image('topPanel', 'assets/gui/gui_TopPanel.png');
        game.load.image('rightPanel', 'assets/gui/gui_RightPanel.png');
        game.load.image('leftPanel', 'assets/gui/gui_LeftPanel.png');
        game.load.image('bottomPanel', 'assets/gui/gui_BottomPanel.png');
        game.load.image('rightMiddlePanel', 'assets/gui/gui_RightPanel_Middle.png');
        game.load.image('rightMiddlePanelStats', 'assets/gui/gui_RightPanel_Middle_Stats.png');
        game.load.image('statsButtonInactive', 'assets/gui/gui_StatsButton_Inactive.png');
        game.load.image('statsButtonActive', 'assets/gui/gui_StatsButton_Active.png');
        game.load.image('inventoryButtonInactive', 'assets/gui/gui_InventoryButton_Inactive.png');
        game.load.image('inventoryButtonActive', 'assets/gui/gui_InventoryButton_Active.png');
        game.load.image('skillsButtonInactive', 'assets/gui/gui_SkillsButton_Inactive.png');
        game.load.image('skillsButtonActive', 'assets/gui/gui_SkillsButton_Active.png');
        game.load.image('spellsButtonInactive', 'assets/gui/gui_SpellsButton_Inactive.png');
        game.load.image('spellsButtonActive', 'assets/gui/gui_SpellsButton_Active.png');
        game.load.spritesheet('player', 'assets/PlayerSheet.png', 46, 45, 16);
        game.load.spritesheet('player2', 'assets/PlayerSheet2.png', 46, 45, 16);
        game.load.spritesheet('goldSprites', 'assets/GoldSheet.png', 32, 32, 10);

        game.load.spritesheet('defaultBody', 'assets/DefaultBody.png', 46, 45, 16);
        game.load.spritesheet('maleHead1', 'assets/MaleHead1.png', 46, 45, 16);
    },

    create: function(){
        game.state.start('menu');
    }
}