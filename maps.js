//Convert boolean 2D array into tilemap
/* 

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
        this.layers.push(this.map.createBlankLayer('items', 18, 13, 32, 32));
        this.mapData = null;
        game.global.itemLayer = game.add.group();
        game.global.playerLayer = game.add.group();
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
        console.log(this.mapData);

        for (var x = 0; x < 12; x++){
            for (var y = 0; y < 17; y++) {
                
                this.map.putTile(this.mapData.mapData[x][y], y+1, x+1, this.layers[0]);
            }
        }

        for(var i in this.mapData.items){
            if (this.mapData.items[i].isSpawned){
                var thisTile = this.map.getTile(this.mapData.items[i].pos.x+1, this.mapData.items[i].pos.y+1, this.layers[0], true);
                var item = game.add.sprite(thisTile.worldX+16, thisTile.worldY+16, this.mapData.items[i].itemName); //adjust position
                item.anchor.setTo(0.5);
                this.game.global.items[this.mapData.items[i].locationId] = item;
                this.game.global.itemLayer.add(item);
            }
        }

        for(var i in this.mapData.npcs){
            if(this.mapData.npcs[i].isSpawned){
                var thisNPC = this.mapData.npcs[i];
                game.global.npcList[thisNPC.npcId] = {npc: thisNPC, npcObject: null};
                game.global.npcList[thisNPC.npcId].npcObject = new NPCObject(thisNPC.npcId, game);
            }
        }
        console.log(game.global.npcList);
    }

    isSpotAvailable(x, y, originPos){
        var thisTile = this.map.getTile(originPos.x+1, originPos.y+1, this.layers[0], true);
        var nextTile = this.map.getTile(x+1, y+1, this.layers[0], true);
        if(thisTile != null){
            if(thisTile.index != -1 && (nextTile == null || nextTile.index != 1)){ //Unacceptable tiles
                //move from acceptable tile into acceptable tile
                if(nextTile == null || nextTile.index == -1){
                    this.game.global.localPlayerObject.playerSprite.kill();
                }
                return true;
            }
        }
        //Trying to move to a spot that is not allowed
        return false;
    }

    spawnItem(newItem){
        var thisTile = this.map.getTile(newItem.pos.x+1, newItem.pos.y+1, this.layers[0], true);
        var item = game.add.sprite(thisTile.worldX+16, thisTile.worldY+16, newItem.itemName); //adjust position
        item.anchor.setTo(0.5);
        this.game.global.items[newItem.locationId] = item;
        this.mapData.items[newItem.locationId] = item;
        this.game.global.itemLayer.add(item);
    }

    spawnNPC(newNPC){
        game.global.npcList[newNPC.npcId] = {npc: newNPC, npcObject: null};
        game.global.npcList[newNPC.npcId].npcObject = new NPCObject(newNPC.npcId, game);
        this.mapData.npcs[newNPC.npcId] = newNPC;
    }


    
}