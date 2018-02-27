var menuState = {
    create: function(){

        //var guiMenu = game.add.sprite(game.world.centerX, game.world.centerY, 'menuScreen');
        var guiLoadCharacter = game.add.sprite(game.world.centerX, game.world.centerY);
        //guiMenu.anchor.set(0.5);
        guiLoadCharacter.anchor.set(0.5);
        guiLoadCharacter.inputEnabled = true;
        guiLoadCharacter.events.onInputDown.add(listener, this);
    }
}

function listener() {
    game.state.start('main');
}