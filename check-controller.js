var jobQueue = require('jobQueue');
var ClaimController = require('job-claim-controller');
var UpgradeController = require('job-upgrade-controller');

module.exports = function() {
	if(!Memory.nextControllerCheck || Memory.nextControllerCheck <= Game.time) {
		Memory.nextControllerCheck = Game.time + 300;
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
					job = new ClaimController(controller.id);
				}
				else if(controller.my && controller.level < 8) {
					console.log('upgrade controller');
					job = new UpgradeController(controller.id);
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
}