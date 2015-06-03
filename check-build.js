var jobQueue = require('jobQueue');
var Build = require('job-build');
var spawn = require('spawn');

module.exports = function() {
	if(!Memory.nextBuildCheck || Memory.nextBuildCheck <= Game.time) {
		Memory.nextBuildCheck = Game.time + 30;
	console.log('Checking unfinished construction sites');
		
		_.each(Game.rooms, function(room){
			var sites = room.find(FIND_CONSTRUCTION_SITES, {filter:{my:true}});

	console.log('    found ' + sites.length + ' construction sites');

			_.each(sites, function(site){
				var job = new Build(site.id);
				
				if(!jobQueue.jobExists(room, job)) {
					jobQueue.addJob(room, job, [WORK, CARRY, MOVE], site.pos, 0);
					jobQueue.addJob(room, job, [WORK, CARRY, MOVE], site.pos, 0);
					jobQueue.addJob(room, job, [WORK, CARRY, MOVE], site.pos, 0);
				}
			});
		});
	}
}