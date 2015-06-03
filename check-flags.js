var jobQueue = require('jobQueue');
var utils = require('utils');

module.exports = function() {
	if(!Memory.nextFlagCheck || Memory.nextFlagCheck <= Game.time) {
		Memory.nextFlagCheck = Game.time + 30;
	console.log('Checking indicator flags');
		
		_.each(Game.rooms, function(room){
			var flags = room.find(FIND_FLAGS);

			_.each(flags, function(flag){
				var parts = flag.name.split('_');
				
				if(parts[0] == 'Ext') {
					var direction = utils.getDirection(parts[1]);
					var size = parts[2];

					var pos = flag.pos;
					
					var left = direction - 2;
					var right = direction + 2;
					var toggleSide = false;

					for(var i = 0; i < size; i++) {
						var side = toggleSide ? left : right;
						
						var offset = utils.getOffset(pos, side);

						room.createConstructionSite(offset.x, offset.y, STRUCTURE_EXTENSION);
						
						if(toggleSide) {
							pos = utils.getOffset(pos, direction);
						}
						
						toggleSide = !toggleSide;
					}
					
					flag.remove();
					var name = utils.randomString();
					room.createFlag(flag.pos, 'Bank_' + name + '_Start');
					room.createFlag(pos.x, pos.y, 'Bank_' + name + '_End');
					Memory.nextBuildCheck = Game.time;
				}
			});
		});
	}
}