var jobQueue = require('jobQueue');
var Repair = require('job-repair');

if(!Memory.lastRepairCheck || Memory.lastRepairCheck < Game.time - 30) {
    Memory.lastRepairCheck = Game.time;
console.log('Checking damaged structures');
    
    _.each(Game.rooms, function(room){
        var filter = {
            filter: function filterRepairables(i) {
                return i.hits < i.hitsMax / 2;
            }
        };
        
        var structures = room.find(FIND_STRUCTURES, filter);
        
console.log('    found ' + structures.length + ' damaged structures');
        
        _.each(structures, function(structure){
            var job = new Repair(structure.id);
            
            if(!jobQueue.jobExists(room, job)) {
                jobQueue.addJob(room, job, [WORK, CARRY, MOVE], structure.pos, 0);
            }
        });
    });
}