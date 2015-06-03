var jobQueue = require('jobQueue');
var bodies = require('bodies');


function getEnergy(room, useOnlyPoweredExt) {
    var extensions = Memory.extensions;

    if(useOnlyPoweredExt) {
        extensions = room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_EXTENSION, energy: 50}}).length;
    }

    return 300 + (extensions * 50);
}

function createCreep(spawn, body, memory) {
    var result = spawn.createCreep(body, null, memory);
    
console.log('creating creep ' + result + ': ' + JSON.stringify(memory));
console.log('    with body ' + JSON.stringify(body));

    return !(_.isNumber(result) && result < 0);
}

function CreateCreepJob(bodyType, memory, useOnlyPoweredExt) {
    this.type = 'create-creep';
    this.bodyType = bodyType;
    this.memory = memory;
	this.useOnlyPoweredExt = useOnlyPoweredExt;
}

CreateCreepJob.prototype.perform = function(room) {
    var spawns = room.find(FIND_MY_SPAWNS)
    
    var spawn = _.find(spawns, 'memory.busy', false) || _.max(spawns, _.property('energy'));

    if(!spawn) {
        console.log("No spawns in room: " + room.name)
        return;
    }

    spawn.memory.busy = true;

    var energy = getEnergy(room, this.useOnlyPoweredExt);

    var body = bodies[this.bodyType](energy);

    var result = spawn.canCreateCreep(body);
    
    if(result == OK && createCreep(spawn, body, this.memory)) {
        spawn.memory.busy = false;
        Memory.checkExtensions = true;
    }
    else {
        jobQueue.addBackgroundJob(room, this);
    }
}

module.exports = CreateCreepJob;