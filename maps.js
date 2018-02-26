//Convert boolean 2D array into tilemap
/* var changeMap = function(myMap, map, layer) {
    //Based on final map configuration, draw the tiles
    var index = 0;
    for (var x = 0; x < 12; x++){
        for (var y = 0; y < 17; y++) {
            if(myMap[index] == '\n' || myMap[index] == ';'){
                y--;
            }
            else if(myMap[index] != '\n' && myMap[index] != ';'){
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
    game.global.easystar.setGrid(myMap);
    game.global.easystar.setAcceptableTiles([false]);
    game.global.easystar.enableDiagonals();
    game.global.easystar.enableCornerCutting();
} */

var MapManager = class MapManager {
    constructor(game){
        this.game = game;
        this.map = this.game.add.tilemap();
        this.map.addTilesetImage('tileset', null, 32, 32);
        this.layers = [];
        this.layers.push(this.map.create('map', 18, 13, 32, 32));
        this.mapData = null;
    }

    get getMap(){
        return this.map;
    }

    getLayer(index){
        return this.layers[index];
    }

    setMapData(mapData){
        this.mapData = mapData;
        this.changeMap();
    }

    changeMap(){
        for (var x = 0; x < 12; x++){
            for (var y = 0; y < 17; y++) {
                
                this.map.putTile(this.mapData[x][y], y+1, x+1, this.layers[0]);
            
            }
        }
    }

    isSpotAvailable(x, y, originPos){
        var thisTile = this.map.getTile(originPos.x+1, originPos.y+1, this.layers[0], true);
        var nextTile = this.map.getTile(x+1, y+1, this.layers[0], true);
        if(thisTile != null){
            if(thisTile != null && thisTile.index != -1 && (nextTile == null || nextTile.index == 0)){
                //move from acceptable tile into acceptable tile
                return true;
            }
        }
        //Trying to move to a spot that is not allowed
        return false;
    }


    
}