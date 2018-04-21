class NPC{
    constructor(data){
        this.npcId = data.npcId;
        this.npcName = data.npcName;
        this.worldX = data.worldX;
        this.worldY = data.worldY;
        this.pos = {x: data.localX, y: data.localY};
        this.spawnLoc = {x: data.localX, y: data.localY};
        this.level = data.level;
        this.class = data.class;
        this.aggroRange = data.aggroRange;
        this.isPassive = data.isPassive;
        this.baseExp = data.baseExp;
        this.isSpawned = data.isSpawned;
        this.respawnable = data.respawnable;
        this.respawnTimer = data.respawnTimer;
        this.faction = data.faction;
        this.doesRoam = data.doesRoam;
        this.npcAction = 'idle';
        this.npcFacing = 'S';
        this.target = null;
        this.isHuman = data.isHuman;
        this.maxHealth = data.maxHealth;
        this.health = data.health;
        this.maxFocus = data.maxFocus;
        this.focus = data.focus;
        this.maxStamina = data.maxStamina;
        this.stamina = data.stamina;
        this.strength = data.strength;
        this.dexterity = data.dexterity;
        this.endurance = data.endurance;
        this.agility = data.agility;
        this.arcane = data.arcane;
        this.luck = data.luck;
        this.physicalAttack = data.physicalAttack;
        this.physicalDefense = data.physicalDefense;
        this.physicalEvasion = data.physicalEvasion;
        this.magicalAttack = data.magicalAttack;
        this.magicalDefense = data.magicalDefense;
        this.magicalEvasion = data.magicalEvasion;
        this.gender = data.gender;
        this.headType = data.headType;
        this.equipHead = data.equipHead;
        this.equipTorso = data.equipTorso;
        this.equipRight = data.equipRight;
        this.equipLeft = data.equipLeft;
        this.inventory = [
            {itemId: data.slot1, dropRate: data.slot1DropRate}, {itemId: data.slot2, dropRate: data.slot2DropRate},
            {itemId: data.slot3, dropRate: data.slot3DropRate}, {itemId: data.slot4, dropRate: data.slot4DropRate},
            {itemId: data.slot5, dropRate: data.slot5DropRate}, {itemId: data.slot6, dropRate: data.slot6DropRate}
        ];

        this.spells = {};
        this.isPerformingAction = false;
        this.isActive = false; //Set to true when a player is on the same map
        
        for(var i = 0; i < 5; i++){
            var spellSlot = parseInt(i) + 1;
            if(data['spell' + spellSlot] != 0){
                var thisSpellId = data['spell' + spellSlot];
                this.spells[thisSpellId] = spellData[thisSpellId];
            }
        }

        if(this.respawnable && !this.isSpawned){
            setTimeout(() => this.respawn(), this.respawnTimer);
        }
    }

    respawn(){
        this.isSpawned = true;
        this.pos = this.spawnLoc;
        this.target = null;
        this.isActive = false;
        this.health = this.maxHealth;
        con.query("UPDATE npcs SET isSpawned = 1 WHERE npcId = '" + this.npcId + "'", function (err, result, fields) {});
        worldMap[this.worldX + '-' + this.worldY].npcs[this.npcId] = this;
        for(var i in worldMap[this.worldX + '-' + this.worldY].players) {
            var index = worldMap[this.worldX + '-' + this.worldY].players[i].playerId;
            var visiblePlayer = players[index];

            if(this.isActive == false){
                this.isActive = true;
                activeNPCs[this.npcId] = this;
                console.log(this.npcName + " is now active");
            }
            visiblePlayer.remote.placeNPC(this); 
        }
    }

    decideAction(){
        var shouldStayActive = false;
        var visiblePlayers = [];
        for(var i in worldMap[this.worldX + '-' + this.worldY].players){
            visiblePlayers.push(worldMap[this.worldX + '-' + this.worldY].players[i]);
            if(shouldStayActive == false){
                shouldStayActive = true;
            }
        }

        if(!shouldStayActive){
            this.isActive = false;
            delete activeNPCs[this.npcId];
            console.log(this.npcName + " is now inactive");
            return;
        }
        else if(!this.isPerformingAction){
            this.isPerformingAction = true;
            this.stamina = this.stamina == this.maxStamina ? this.stamina : this.stamina + 1;
            var randomTimeout = Math.floor(Math.random() * Math.floor(1500));
            var willWander = false;
            var willAttack = false;
            var willFollow = false;
            var targetPos = {x: null, y: null};
            var nextPos = {x: null, y: null};
            this.npcAction = 'idle';
            
            //If isPassive == false,
            if(!this.isPassive){

                //if target == null, try to find a target within the AggroRange
                if(this.target == null){
                    var minX = this.pos.x - this.aggroRange;
                    var minY = this.pos.y - this.aggroRange;
                    var maxX = this.pos.x + this.aggroRange;
                    var maxY = this.pos.y + this.aggroRange;

                    for(var i in worldMap[this.worldX + '-' + this.worldY].players){
                        var thisPlayer = worldMap[this.worldX + '-' + this.worldY].players[i];
                        if(this.target == null && thisPlayer.pos.x >= minX && thisPlayer.pos.x <= maxX && thisPlayer.pos.y >= minY && thisPlayer.pos.x){
                            //Player is within range
                            this.target = thisPlayer.playerId;
                            //targetPos = thisPlayer.pos;
                        }
                    }

                }
                else{
                    //update targetPos
                    if(worldMap[this.worldX + '-' + this.worldY].players[this.target] != undefined){
                        targetPos = worldMap[this.worldX + '-' + this.worldY].players[this.target].pos;
                    }
                    else{
                        this.target = null;
                    }
                }
            }
            else{
                var whichPlayerIndex = Math.floor(Math.random() * (Object.keys(worldMap[this.worldX + '-' + this.worldY].players).length + 1));
                var whichPlayer = worldMap[this.worldX + '-' + this.worldY].players[Object.keys(worldMap[this.worldX + '-' + this.worldY].players)[whichPlayerIndex]];
                if(this.npcName == 'Wenslas' && whichPlayer != undefined){
                    this.target = whichPlayer.playerId;
                }
            }


            //if no target exists, just wander around
            if(this.target == null){
                willWander = true;
            }
            else{
                //if target != null
                targetPos = worldMap[this.worldX + '-' + this.worldY].players[this.target].pos;
                if(!this.isPassive && (((this.pos.x + 1 == targetPos.x || this.pos.x - 1 == targetPos.x) && this.pos.y == targetPos.y)
                    || ((this.pos.y + 1 == targetPos.y || this.pos.y - 1 == targetPos.y) && this.pos.x == targetPos.x))){
                    //if next to the target: ATTACK
                    willAttack = true;
                    this.npcAction = 'attack';
                    if(this.pos.x < targetPos.x){
                        this.npcFacing = 'E'
                    }
                    else if(this.pos.x > targetPos.x){
                        this.npcFacing = 'W'
                    }
                    else if(this.pos.y < targetPos.y){
                        this.npcFacing = 'S'
                    }
                    else if(this.pos.y > targetPos.y){
                        this.npcFacing = 'N'
                    }
                    var damage = Math.floor(((this.strength / 10) * this.physicalAttack) + ((this.agility / 3) * (this.stamina / this.maxStamina)) + Math.floor(Math.random() * Math.floor(6)));
                    this.stamina = this.stamina == 0 ? 0 : this.stamina - (Math.floor(Math.random() * Math.floor(5)) + 1);
                    players[this.target].state.takePhysicalDamage(damage, this.npcId, 'npc');
                    this.isPerformingAction = false;
                }
                else{
                    //else try to find a path to the target, or cast spell
                    willFollow = true;
                    if(Object.keys(this.spells).length != 0 && Math.floor(Math.random() * Math.floor(5)) <= 1){ //&& Math.floor(Math.random() * Math.floor(3)) <= 2
                        var whichSpellIndex = Math.floor(Math.random() * Object.keys(this.spells).length);
                        var whichSpell = this.spells[Object.keys(this.spells)[whichSpellIndex]];
                        if(whichSpell.spellType == 2){ //target
                            whichSpell.cast(this.npcId, this.target, 'npc', 'player');
                        }
                        else if(whichSpell.spellType == 1){ //projectile
                            if(this.pos.x < players[this.target].state.xAxis && this.pos.y == players[this.target].state.yAxis){
                                this.npcFacing = 'E'
                            }
                            else if(this.pos.x > players[this.target].state.xAxis && this.pos.y == players[this.target].state.yAxis){
                                this.npcFacing = 'W'
                            }
                            else if(this.pos.y < players[this.target].state.yAxis && this.pos.x == players[this.target].state.xAxis){
                                this.npcFacing = 'S'
                            }
                            else if(this.pos.y > players[this.target].state.yAxis && this.pos.x == players[this.target].state.xAxis){
                                this.npcFacing = 'N'
                            }
                            whichSpell.cast(this.npcId, this.target, 'npc', 'player');
                        }
                        this.npcAction = 'attack';
                        this.isPerformingAction = false;
                        willFollow = false;
                    }
                    else{
                        var path = aStar.run({xAxis: this.pos.x, yAxis: this.pos.y}, {xAxis: targetPos.x, yAxis: targetPos.y}, worldGrid[this.worldX + '-' + this.worldY]);
                        if(path != undefined && path != null){
                            if(this.pos.x < path[1].xAxis){
                                this.npcFacing = 'E'
                            }
                            else if(this.pos.x > path[1].xAxis){
                                this.npcFacing = 'W'
                            }
                            else if(this.pos.y < path[1].yAxis){
                                this.npcFacing = 'S'
                            }
                            else if(this.pos.y > path[1].yAxis){
                                this.npcFacing = 'N'
                            }
                            this.pos.x = path[1].xAxis;
                            this.pos.y = path[1].yAxis;
                            this.npcAction = 'idle';
                            this.isPerformingAction = false;
                        }
                        else{
                            //if no path exists, set target to null and just wander
                            willFollow = false;
                            willWander = true;
                            this.target = null;
                        }
                    }
                }
            }
                        
            if(willWander && this.doesRoam){
                setTimeout(() => {
                    //just make them wander around for now
                    //this.npcAction = 'idle';
                    var directionToMove = Math.floor(Math.random() * Math.floor(5)); //if 4, we just idle on this cycle
                    if(directionToMove == 0){ //East
                        var nextX = this.pos.x + 1;
                        var nextY = this.pos.y;
                        if(nextX < 16){
                            var nextTile = worldMap[this.worldX + "-" + this.worldY].mapData[nextY][nextX];
                            var isOpenSpace = true;
                            for(var player of visiblePlayers){
                                if(player.pos.x == nextX && player.pos.y == nextY){
                                    isOpenSpace = false;
                                }
                            }
                            if(nextTile == 0 && isOpenSpace){ //acceptableTiles
                                this.pos.x = nextX;
                                this.pos.y = nextY;
                                //this.npcAction = 'walk';
                                this.npcFacing = 'E';
                                visiblePlayers.forEach((player) => {
                                    if(players[player.playerId].state.mapData != undefined){
                                        players[player.playerId].state.mapData.npcs[this.npcId] = this;
                                    }
                                });
                            }
                        }  
                    }
                    if(directionToMove == 1){ //West
                        var nextX = this.pos.x - 1;
                        var nextY = this.pos.y;
                        if(nextX > 0){
                            var nextTile = worldMap[this.worldX + "-" + this.worldY].mapData[nextY][nextX];
                            var isOpenSpace = true;
                            for(var player of visiblePlayers){
                                if(player.pos.x == nextX && player.pos.y == nextY){
                                    isOpenSpace = false;
                                }
                            }
                            if(nextTile == 0 && isOpenSpace){ //acceptableTiles
                                this.pos.x = nextX;
                                this.pos.y = nextY;
                                //this.npcAction = 'walk';
                                this.npcFacing = 'W';
                                visiblePlayers.forEach((player) => {
                                    if(players[player.playerId].state.mapData != undefined){
                                        players[player.playerId].state.mapData.npcs[this.npcId] = this;
                                    }
                                });
                            }
                        }  
                    }
                    if(directionToMove == 2){ //North
                        var nextX = this.pos.x;
                        var nextY = this.pos.y - 1;
                        if(nextY > 0){
                            var nextTile = worldMap[this.worldX + "-" + this.worldY].mapData[nextY][nextX];
                            var isOpenSpace = true;
                            for(var player of visiblePlayers){
                                if(player.pos.x == nextX && player.pos.y == nextY){
                                    isOpenSpace = false;
                                }
                            }
                            if(nextTile == 0 && isOpenSpace){ //acceptableTiles
                                this.pos.x = nextX;
                                this.pos.y = nextY;
                                //this.npcAction = 'walk';
                                this.npcFacing = 'N';
                                visiblePlayers.forEach((player) => {
                                    if(players[player.playerId].state.mapData != undefined){
                                        players[player.playerId].state.mapData.npcs[this.npcId] = this;
                                    }
                                });
                            }
                        }  
                    }
                    if(directionToMove == 3){ //South
                        var nextX = this.pos.x;
                        var nextY = this.pos.y + 1;
                        if(nextY < 11){
                            var nextTile = worldMap[this.worldX + "-" + this.worldY].mapData[nextY][nextX];
                            var isOpenSpace = true;
                            for(var player of visiblePlayers){
                                if(player.pos.x == nextX && player.pos.y == nextY){
                                    isOpenSpace = false;
                                }
                            }
                            if(nextTile == 0 && isOpenSpace){ //acceptableTiles
                                this.pos.x = nextX;
                                this.pos.y = nextY;
                                //this.npcAction = 'walk';
                                this.npcFacing = 'S';
                                visiblePlayers.forEach((player) => {
                                    if(players[player.playerId].state.mapData != undefined){
                                        players[player.playerId].state.mapData.npcs[this.npcId] = this;
                                    }
                                });
                            }
                        }  
                    }
                    this.isPerformingAction = false;
                }, randomTimeout);
            }
            else{
                this.isPerformingAction = false;
            }
        }
    }

    takePhysicalDamage(damage, attackerId){ //attackerId can be null if player is taking damage from not a player
        var damageMitigated = Math.floor(((this.endurance / 10) * this.physicalDefense) + Math.floor(Math.random() * Math.floor(3)));
        if(damage - damageMitigated <= 0){
            //0 damage
            for (var c in worldMap[this.worldX + '-' + this.worldY].players){
                var remote = players[c].remote;
                //remote.showDamage(0, 'npc', this.npcId);
                remote.showStatus('BLOCK', 'npc', this.npcId);
            }
            return
        }
        var chanceToDodge = Math.floor(Math.random() * Math.floor(100 - ((this.agility / 2) + this.physicalEvasion)));
        if(chanceToDodge <= 5){
            //dodged it
            for (var c in worldMap[this.worldX + '-' + this.worldY].players){
                var remote = players[c].remote;
                remote.showStatus('MISS', 'npc', this.npcId);
            }
            return
        }
        this.health -= (damage - damageMitigated);
        if(this.health > 0){
            if(this.target == null){
                this.target = attackerId;
            }
            if(this.isPassive){
                this.isPassive = false;
            }
            for (var c in worldMap[this.worldX + '-' + this.worldY].players){
                var remote = players[c].remote;
                remote.showDamage((damage - damageMitigated), 'npc', this.npcId);
            }
        }
        else{
            delete worldMap[this.worldX + '-' + this.worldY].npcs[this.npcId];
            this.isActive = false;
            delete activeNPCs[this.npcId];
            console.log(this.npcName + " is now inactive");
            this.isSpawned = false;
            for (var c in worldMap[this.worldX + '-' + this.worldY].players){
                var remote = players[c].remote;
    
                //here we call kill() method defined in the client side
                remote.removeNPC(this.npcId)
            }
            con.query("UPDATE npcs SET isSpawned = 0 WHERE npcId = '" + this.npcId + "'", function (err, result, fields) {});
            
            if(attackerId != undefined){
                var winner = players[attackerId].state;
                var exp = this.baseExp + (winner.level - this.level);
                var equipItems = [];
                if(winner.equipRight == 1 && winner.equipLeft == 1){
                    equipItems.push('fists');
                }
                else{
                    equipItems = [itemData[winner.equipRight].itemType, itemData[winner.equipLeft].itemType];
                }
                winner.getExp(exp, equipItems);
            }
            if(this.respawnable){
                setTimeout(() => this.respawn(), this.respawnTimer);
            }
        }
    }
};

module.exports = NPC;