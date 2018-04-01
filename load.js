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
        game.load.image('leftArrow', 'assets/gui/gui_LeftArrow.png');
        game.load.image('rightArrow', 'assets/gui/gui_RightArrow.png');
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
        game.load.image('equipmentPanel', 'assets/gui/gui_Equipment.png');
        game.load.image('xButton', 'assets/gui/gui_XButton.png');
        game.load.image('contextUse', 'assets/gui/gui_Context_Use.png');
        game.load.image('contextDrop', 'assets/gui/gui_Context_Drop.png');
        game.load.image('contextCancel', 'assets/gui/gui_Context_Cancel.png');
        game.load.image('contextEquipHead', 'assets/gui/gui_Context_EquipHead.png');
        game.load.image('contextEquipTorso', 'assets/gui/gui_Context_EquipTorso.png');
        game.load.image('contextEquipRight', 'assets/gui/gui_Context_EquipRight.png');
        game.load.image('contextEquipLeft', 'assets/gui/gui_Context_EquipLeft.png');
        game.load.image('contextEquipLegs', 'assets/gui/gui_Context_EquipLegs.png');
        game.load.image('contextEquipExtra', 'assets/gui/gui_Context_EquipExtra.png');
        game.load.spritesheet('player', 'assets/PlayerSheet.png', 46, 45, 16);
        game.load.spritesheet('player2', 'assets/PlayerSheet2.png', 46, 45, 16);
        game.load.spritesheet('goldSprites', 'assets/GoldSheet.png', 32, 32, 10);

        game.load.spritesheet('defaultBody', 'assets/DefaultBody.png', 46, 45, 16);
        game.load.spritesheet('maleHead1', 'assets/MaleHead1.png', 46, 45, 16);
        game.load.spritesheet('maleHead2', 'assets/MaleHead2.png', 46, 45, 16);
        game.load.spritesheet('maleHead3', 'assets/MaleHead3.png', 46, 45, 16);
        game.load.spritesheet('femaleHead1', 'assets/FemaleHead1.png', 46, 45, 16);
        game.load.spritesheet('femaleHead2', 'assets/FemaleHead2.png', 46, 45, 16);
        game.load.spritesheet('femaleHead3', 'assets/FemaleHead3.png', 46, 45, 16);
        game.load.spritesheet('knifeRight', 'assets/items/knifeRight.png', 46, 45, 16);
        game.load.spritesheet('knifeLeft', 'assets/items/knifeLeft.png', 46, 45, 16);
        game.load.spritesheet('leatherCapHead', 'assets/items/leatherCapHead.png', 46, 45, 16);
        game.load.spritesheet('leatherArmorTorso', 'assets/items/leatherArmorTorso.png', 46, 45, 16);
        game.load.spritesheet('NOTHINGRight', 'assets/items/NOTHINGRight.png', 46, 45, 16);
        game.load.spritesheet('NOTHINGLeft', 'assets/items/NOTHINGLeft.png', 46, 45, 16);
        game.load.spritesheet('NOTHINGHead', 'assets/items/NOTHINGHead.png', 46, 45, 16);
        game.load.spritesheet('NOTHINGTorso', 'assets/items/NOTHINGTorso.png', 46, 45, 16);
        game.load.spritesheet('NOTHINGExtra', 'assets/items/NOTHINGExtra.png', 46, 45, 16);

        game.load.image('knife', 'assets/items/Knife.png');
        game.load.image('NOTHING', 'assets/items/NOTHING.png');
        game.load.image('leatherCap', 'assets/items/LeatherCap.png');
        game.load.image('leatherArmor', 'assets/items/LeatherArmor.png');

        game.load.spritesheet('slime', 'assets/monsters/slime.png', 32, 27, 16);
    },

    create: function(){
        game.state.start('menu');
    }
}