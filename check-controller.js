var jobQueue = require('jobQueue');
var jobber = require('jobs');
var ClaimControllerJob = require('job-claimController');
var UpgradeControllerJob = require('job-upgradeController');

if(!Memory.lastControllerCheck || Memory.lastControllerCheck < Game.time - 300) {
    Memory.lastControllerCheck = Game.time;
console.log('Checking controllers');
    
    _.each(Game.rooms, function(room){
        var filter = {
            filter: function filterUpgradable(i) {
                return i.structureType == STRUCTURE_CONTROLLER;
            }
        };
        
        var controllers = room.find(FIND_STRUCTURES, filter);

        _.each(controllers, function(controller) {
            var job;
            
            if(controller.level == 0) {
                console.log('claim controller');
                job = new ClaimControllerJob(controller.id);
            }
            else if(controller.my && controller.level < 8) {
                console.log('upgrade controller');
                job = new UpgradeControllerJob(controller.id);
            }
            else {
                console.log('attack controller (todo)');
            }
            
            if(job && !jobQueue.jobExists(room, job)) {
                jobQueue.addJob(room, job, [CARRY, MOVE], controller.pos, 2);
            }
        });
    });
}