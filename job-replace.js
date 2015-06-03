var utils = require('utils');

function Replace(target) {
    this.type = 'replace';
    this.target = target;
}

Replace.prototype.perform = function(creep) {
    creep.memory.mode = creep.memory.mode || 'track';
    
    if(creep.memory.mode == 'track') {
        var target = Game.creeps[this.target];
        
        if(!target) {
            creep.memory.mode = 'become';
        }
        else if(creep.pos.isNearTo(target)) {
            target.cancelOrder('move')
            target.suicide();
            creep.memory.mode = 'become';
            creep.memory.pos = target.pos;
        }
        else {
            creep.moveTo(target);
        }
    }
    else if(creep.memory.mode == 'become') {
        utils.pickupDroppedEnergy(creep);
        if(creep.memory.pos) {
            creep.moveTo(creep.memory.pos.x, creep.memory.pos.x);
        }
        creep.memory = Memory.creeps[this.target];
        creep.memory.replacing = undefined;
		
        Memory.creeps[this.target] = undefined;
    }
}

module.exports = Replace;