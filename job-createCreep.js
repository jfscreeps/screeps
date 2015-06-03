var jobber = require('jobRegistry');
var jobQueue = require('jobQueue');

function createCreep(spawn, body, memory) {
    var result = spawn.createCreep(body, null, memory);
    
console.log(result + ': ' + JSON.stringify(memory));

    return !(_.isNumber(result) && result < 0);
}

function CreateCreepJob(body, memory) {
    this.type = 'CreateCreepJob';
    this.body = body;
    this.memory = memory;
}

CreateCreepJob.prototype.perform = function(room) {
    var spawns = room.find(FIND_MY_SPAWNS)
    
    var spawn = _.find(spawns, 'memory.busy', false) || _.max(spawns, _.property('energy'));

    if(!spawn) {
        console.log("No spawns in room: " + room.name)
        return;
    }

    spawn.memory.busy = true;
    
    var result = spawn.canCreateCreep(this.body);
    
    if(result == OK && createCreep(spawn, this.body, this.memory)) {
        spawn.memory.busy = false;
        Memory.nextExtensionCheck = Game.time
    }
    else {
        jobQueue.addBackgroundJob(room, this);
    }
}

module.exports = CreateCreepJob;

jobber.registerJobType('CreateCreepJob', function(def) { 
    return new CreateCreepJob(def.body, def.memory);
});