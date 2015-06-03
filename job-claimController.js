var jobQueue = require('jobQueue');
var jobber = require('jobRegistry');
var utils = require('utils');
var UpgradeControllerJob = require('job-upgradeController');

function ClaimControllerJob(id) {
    this.type = 'ClaimControllerJob';
    this.id = id;
}

ClaimControllerJob.prototype.perform = function(creep) {
    var controller = Game.structures[this.id];
    
    if(!controller) {
creep.say('not found');
        jobQueue.jobComplete(creep);
        return;
    }
    
    utils.absorbEnergy(creep);

    creep.moveTo(controller);
    if(creep.pos.isNearTo(controller)) {
        creep.claimController(controller);
        
        jobQueue.jobComplete(creep);
        jobQueue.addJob(creep.room, new UpgradeControllerJob(controller.id), [MOVE, CARRY], controller.pos, 2, creep);
    }

}

module.exports = ClaimControllerJob;

jobber.registerJobType('ClaimControllerJob', function(def) {
    return new ClaimControllerJob(def.id);
});