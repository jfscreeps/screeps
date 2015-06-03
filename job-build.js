var jobQueue = require('jobQueue');
var jobber = require('jobRegistry');
var utils = require('utils');
var Refuel = require('job-refuel');

function Build(id) {
    this.type = 'Build'
    this.id = id;
}

Build.prototype.perform = function(creep) {
    var results = creep.room.find(FIND_CONSTRUCTION_SITES, {filter: {id: this.id}});
    
    if(results.length == 0)
    {
        creep.say('cant find site');
        jobQueue.jobComplete(creep);
        return;
    }
    
    var site = results[0];
    
    creep.moveTo(site);
    creep.build(site);

    if(site.progress == site.progressTotal)
    {
creep.say('done');
        jobQueue.jobComplete(creep);
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

jobber.registerJobType('Build', function(def) {
    return new Build(def.id);
});