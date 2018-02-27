var loadPlayerState = {
    
    create: function(){
        var loginScreen = game.add.sprite(game.world.centerX, game.world.centerY, 'loginScreen');
        var cancelButton = game.add.sprite(game.world.centerX * 1.075, game.world.centerY * 1.1255, 'cancelButton');
        var confirmButton = game.add.sprite(game.world.centerX * 1.22225, game.world.centerY * 1.125, 'confirmButton');

        loginScreen.anchor.set(0.5);
        cancelButton.anchor.set(0.5);
        confirmButton.anchor.set(0.5);

        cancelButton.inputEnabled = true;
        cancelButton.events.onInputDown.add(listenerCancel, this);
    }
}

function listenerCancel() {
    game.state.start('menu');
}