var jobQueue = require('jobQueue');
var jobber = require('jobRegistry');
var utils = require('utils');
var RefuelJob = require('job-refuel');

function isFull(s){
    return s.level == 8;
}

function transfer(creep, s){
    creep.upgradeController(s);
}

function UpgradeControllerJob(id) {
    this.type = 'UpgradeControllerJob';
    this.id = id;
}

UpgradeControllerJob.prototype.perform = function(creep) {
    var controller = Game.structures[this.id];
    
    if(!controller) {
creep.say('not found');
        jobQueue.jobComplete(creep);
        return;
    }
    
    if(isFull(controller)) {
creep.say('full');
        jobQueue.jobComplete(creep);
        return;
    }
    
    utils.absorbEnergy(creep);

    creep.moveTo(controller);
    if(creep.pos.isNearTo(controller)) {
        transfer(creep, controller);
    }
    
    if(creep.energy == 0) {
        jobQueue.unassign(creep);

        creep.memory.job = new RefuelJob();
    }
}

module.exports = UpgradeControllerJob;

jobber.registerJobType('UpgradeControllerJob', function(def) {
    return new UpgradeControllerJob(def.id);
});