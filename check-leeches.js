var jobQueue = require('jobQueue');

module.exports = function() {
	if(!Memory.nextLeechCheck || Memory.lastLeechCheck <= Game.time) {
		Memory.nextLeechCheck = Game.time + 60;
	console.log('Checking leeches');

		_.each(Game.rooms, function(room){
			var leeches = room.find(FIND_MY_CREEPS, {filter: {memory: {bodyType: 'leech'}}});
			
			_.each(leeches, function(leech){
				var isClose = leech.pos.findInRange(FIND_MY_SPAWNS, 5).length > 0;
				
				var total = isClose ? 1 : 2;
				
				var runners = room.find(FIND_MY_CREEPS, {filter: {memory: {bodyType: 'runner', job: { leech: leech.name }}}});

				leech.memory.need = total - runners.length;
				
			});
		});
	}
}