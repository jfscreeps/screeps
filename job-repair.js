var jobQueue = require('jobQueue');
var utils = require('utils');
var RefuelJob = require('job-refuel');

function RepairJob(id) {
    this.type = 'repair';
    this.id = id;
}

RepairJob.prototype.perform = function(creep) {
    var results = creep.room.find(FIND_STRUCTURES, {filter: {id: this.id}});
    
    if(results.length == 0)
    {
        jobQueue.jobComplete(creep);
        return;
    }
    
    var structure = results[0];
    
    creep.moveTo(structure);
    creep.repair(structure);
    
    utils.absorbEnergy(creep);

    if(creep.energy == 0)
    {
creep.say('need fuel');
        creep.memory.job = new RefuelJob();

        if(structure.hits < structure.hitsMax)
        {
            jobQueue.addJob(creep.room, this, [WORK, CARRY, MOVE], structure.pos, 0);
        }
    }
    else if(structure.hits == structure.hitsMax)
    {
creep.say('done');
        jobQueue.jobComplete(creep);
    }
}

module.exports = RepairJob;