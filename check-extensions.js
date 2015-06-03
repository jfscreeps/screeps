var jobQueue = require('jobQueue');
var TransferEnergy = require('job-transfer-energy');

module.exports = function() {
	if(Memory.checkExtensions) {
	Memory.checkExtensions = undefined;
	
	console.log('Checking low fuel extensions');
		
		_.each(Game.rooms, function(room){
			var extensions = room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_EXTENSION}});
			var links = room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_LINK}});
			
			Memory.extensions = extensions.length;
			
			var structures = extensions.concat(links);
			
			var lowEnergy = _.filter(structures, function(structure) {
				return structure.energy < structure.energyCapacity;
			})
			
	console.log('    found ' + lowEnergy.length + ' low energy structures');

			_.each(lowEnergy, function(structure) {
				var job = new TransferEnergy(structure.id);
				
				if(!jobQueue.jobExists(room, job))
				{
					jobQueue.addJob(room, job, [CARRY, MOVE], structure.pos, 1);
				}
			});
		});
	}
}