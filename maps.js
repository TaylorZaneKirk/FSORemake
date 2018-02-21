//Convert boolean 2D array into tilemap
var changeMap = function(myMap, map, layer) {
    //Based on final map configuration, draw the tiles
    var index = 0;
    for (var x = 0; x < 12; x++){
        for (var y = 0; y < 17; y++) {
            if(myMap[index] == '\n'){
                y--;
            }
            else if(myMap[index] == ';'){
                y--;
            }
            else if(myMap[index] != '\n' && myMap[index] != ';'){
                console.log(myMap[index]);
                console.log(x + ' , ' + y);
                map.putTile(myMap[index], y+1, x+1, layer);
            }
            index++;
        }
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