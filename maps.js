//Convert boolean 2D array into tilemap
var changeMap = function(myMap, map) {
    console.log(map.layer);
    console.log(map.layer);
    //Based on final map configuration, draw the tiles
    var index = 0;
    for (var x = 0; x < 17; x++)
        for (var y = 0; y < 12; y++, index++) {
            /* if(myMap[index] == '\n'){
                //x--;
                y--;
            } */
            console.log(myMap[index]);
            map.putTile(myMap[index], x, y, map.layer);
        }
    //map.setCollision(1); //tile 0 = wall
    //game.global.map = map;
    //game.global.walls = layer2;

    //EasyStar stuff; makes calculations using the raw
    //  2D boolean array to determine paths. This is then
    //  used to interact with tilemap
    /* game.global.easystar.setGrid(myMap);
    game.global.easystar.setAcceptableTiles([false]);
    game.global.easystar.enableDiagonals();
    game.global.easystar.enableCornerCutting(); */
}