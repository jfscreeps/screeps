var spawn = require('spawn');

module.exports = function() {
	if(!Memory.nextOldAgeCheck || Memory.nextOldAgeCheck <= Game.time) {
		Memory.nextOldAgeCheck = Game.time + 150;
	console.log('Checking old age');
		
		_.each(Game.rooms, function(room){
			var filter = {
				filter: function filterOld(x) {
					return x.ticksToLive < 300 && !x.memory.replacing;
				}
			};
			
			var old = room.find(FIND_MY_CREEPS, filter);

			_.each(old, function(creep) {
	console.log('UPGRADING CREEP ' + creep.name);
				spawn.upgrade(creep.name, true);
			});
		});
	}
}