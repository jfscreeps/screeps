var jobQueue = require('jobQueue');
var utils = require('utils');
var Refuel = require('job-refuel');

function Build(id) {
    this.type = 'build'
    this.id = id;
}

function complete(creep){
	jobQueue.jobComplete(creep);
	
	if(creep.memory.buildingExt) {
        Memory.checkExtensions = true;
		creep.memory.buildingExt = undefined;
	}
}

Build.prototype.perform = function(creep) {
    var results = creep.room.find(FIND_CONSTRUCTION_SITES, {filter: {id: this.id}});
    
    if(results.length == 0)
    {
        creep.say('cant find site');
        complete(creep);
        return;
    }
    
    var site = results[0];
    
	creep.memory.buildingExt = site.structureType == STRUCTURE_EXTENSION;
	
    creep.moveTo(site);
    creep.build(site);

    if(site.progress == site.progressTotal)
    {
creep.say('done');
        complete(creep);
        return;
    }
    
    if(creep.energy == 0)
    {
creep.say('need fuel');
        jobQueue.unassign(creep);
        creep.memory.job = new Refuel();
    }
    
    utils.absorbEnergy(creep);
}

module.exports = Build;