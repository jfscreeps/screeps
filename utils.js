var utils = {
    meetsRequirements: function(creep, requirements){
        var body = _(creep.body).map(_.property('type'));

        return _(requirements).all(function(requirement){
            return _(body).contains(requirement);
        });
    },
    absorbEnergy: function(creep) {
        if(creep.energy <= creep.energyCapacity / 2) {
            var spawns = creep.pos.findInRange(FIND_MY_SPAWNS, 1);
        
        	_.each(spawns, function(s){ s.transferEnergy(creep); });
        }
    },
    pickupDroppedEnergy: function(creep) {
        if(creep.energy <= creep.energyCapacity / 2) {
            var energy = creep.pos.findInRange(FIND_DROPPED_ENERGY, 1);
        
        	_.each(energy, function(e){ creep.pickup(e); });
        }
    },
    depositEnergy: function(creep) {
        var destination = findDepositDestination(creep);
        
        if(!destination) return;
        
        if(creep.pos.isNearTo(destination)) {
            creep.transferEnergy(destination);
            creep.memory.destination = undefined;
        }
        else {
            creep.moveTo(destination);
        }
    },
    collectEnergy: function(creep, ignoreBusy) {
        utils.pickupDroppedEnergy(creep);
        
        var destination = findCollectionDestination(creep, ignoreBusy);

        if(!destination) return;
        
        if(creep.pos.isNearTo(destination)) {
            destination.transferEnergy(creep);
            creep.memory.destination = undefined;
        }
        else {
            creep.moveTo(destination);
        }
    },
    getDirection: function(dir) {
        switch(dir) {
            case 'N':  return TOP;
            case 'NE': return TOP_RIGHT;
            case 'E':  return RIGHT;
            case 'SE': return BOTTOM_RIGHT;
            case 'S':  return BOTTOM;
            case 'SW': return BOTTOM_LEFT;
            case 'W':  return LEFT;
            case 'NW': return TOP_LEFT;
        }
    },
    getOffset: function(pos, dir) {
        while(dir < 0) dir += 8;

        dir = ((dir - 1) % 8) + 1;
        
        switch(dir) {
            case TOP:           return {x: pos.x, y: pos.y-1};
            case TOP_RIGHT:     return {x: pos.x+1, y: pos.y-1};
            case RIGHT:         return {x: pos.x+1, y: pos.y};
            case BOTTOM_RIGHT:  return {x: pos.x+1, y: pos.y+1};
            case BOTTOM:        return {x: pos.x, y: pos.y+1};
            case BOTTOM_LEFT:   return {x: pos.x-1, y: pos.y+1};
            case LEFT:          return {x: pos.x-1, y: pos.y};
            case TOP_LEFT:      return {x: pos.x-1, y: pos.y-1};
        }
    },
    randomString: function(){
        return Math.random().toString(36).substring(2, 7);
    }
}

module.exports = utils;

function findCollectionDestination(creep, ignoreBusy) {
    var target;
    
    if(creep.memory.destination) {
        target = Game.creeps[creep.memory.destination]
              || Game.spawns[creep.memory.destination]
              || Game.structures[creep.memory.destination];

        if(target && target.energy == 0){
            creep.memory.destination = undefined;
            target = null;
        }
    }

    if(!target) {
        
        target = findClosestSourceReservoir(creep)
              || findClosestSourceSpawn(creep)
              || findClosestSourceLink(creep);
        
        creep.memory.destination = target && target.name;
    }
    
    return target
}

function findDepositDestination(creep) {
    var target;
    
    if(creep.memory.destination) {
        target = Game.creeps[creep.memory.destination]
              || Game.spawns[creep.memory.destination]
              || Game.structures[creep.memory.destination];

        if(target && target.energy == target.energyCapacity) {
            creep.memory.destination = undefined;
            target = null;
        }
    }

    if(!target) {
        target = findClosestDepositSpawn(creep)
              || findClosestDepositReservoir(creep)
              || findClosestDepositStructure(creep);

        creep.memory.destination = target && (target.name || target.id);
    }
    
    return target;
}

function findClosestSourceReservoir(creep){
    return creep.pos.findClosest(FIND_MY_CREEPS, {filter: function(s){
        return s.memory.bodyType == 'reservoir' && s.energy > 50;
    }})
}

function findClosestSourceSpawn(creep){
    return creep.pos.findClosest(FIND_MY_SPAWNS, {filter: function(s){
        return s.energy > 50;
    }});
}

function findClosestSourceLink(creep){
    return creep.pos.findClosest(FIND_MY_STRUCTURES, {filter: function(s){
        return s.structureType == STRUCTURE_LINK && s.energy > 50;
    }});
}

function findClosestDepositReservoir(creep){
    return creep.pos.findClosest(FIND_MY_CREEPS, {filter: function(s){
        return s.memory.job && s.memory.job.type == 'Reservoir' && s.memory.pos == undefined && s.energy < s.energyCapacity;
    }});
}

function findClosestDepositSpawn(creep){
    return creep.pos.findClosest(FIND_MY_SPAWNS, {filter: function(s){
        return s.energy < s.energyCapacity;
    }});
}

function findClosestDepositStructure(creep){
    return creep.pos.findClosest(FIND_MY_STRUCTURES, {filter: function(s){
        return (s.structureType == STRUCTURE_LINK || s.structureType == STRUCTURE_EXTENSION) && s.energy < s.energyCapacity;
    }});
}