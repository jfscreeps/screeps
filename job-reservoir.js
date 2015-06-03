var jobber = require('jobRegistry');
var utils = require('utils');

function Reservoir(structure, pos) {
    this.type = 'Reservoir';
    this.structure = structure;
    this.pos = pos;
}

Reservoir.prototype.perform = function(creep) {
    if(this.pos && !creep.pos.isEqualTo(this.pos.x, this.pos.y)) {
        creep.say('en route');
        creep.moveTo(this.pos.x, this.pos.y);
        return;
    }
    
    creep.memory.job.pos = undefined;

    if(creep.energy == 0) return;

    var structureId = creep.memory.structure || this.structure;

    if(structureId) {
        var structure = Game.spawns[structureId] || Game.structures[structureId];
        
        if(structure && structure.energy < structure.energyCapacity) {
            creep.transferEnergy(structure);
        }
    }
}

module.exports = Reservoir;

jobber.registerJobType('Reservoir', function(def) { 
    return new Reservoir(def.structure, def.pos);
});