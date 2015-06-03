var jobQueue = require('jobQueue');
var utils = require('utils');
var RefuelJob = require('job-refuel');

function TransferEnergyJob(id) {
    this.type = 'transfer-energy';
    this.id = id;
}

TransferEnergyJob.prototype.perform = function(creep) {
    var results = creep.room.find(FIND_STRUCTURES, {filter: {id: this.id}});
    
    if(results.length == 0) {
        creep.say('not found');
        jobQueue.jobComplete(creep);
        return;
    }
    
    var structure = results[0];
    
    if(structure.energy == structure.energyCapacity) {
        creep.say('full');
        jobQueue.jobComplete(creep);
        return;
    }
    
    utils.absorbEnergy(creep);
    
    if(creep.energy < 50) {
        jobQueue.unassign(creep);
        creep.memory.job = new RefuelJob();
        return;
    }

    creep.moveTo(structure);
    if(creep.pos.isNearTo(structure)) {
        creep.transferEnergy(structure);

        jobQueue.jobComplete(creep);
    }

}

module.exports = TransferEnergyJob;