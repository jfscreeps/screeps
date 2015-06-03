var bodies = require('bodies');
var jobQueue = require('jobQueue');

function getEnergy(room, useOnlyPoweredExt) {
    var extensions = Memory.extensions;

    if(useOnlyPoweredExt) {
        extensions = room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_EXTENSION, energy: 50}}).length;
    }

    return 300 + (extensions * 50);
}

function queueCreep(room, useOnlyPoweredExt, bodyType, memory) {
    room = Game.rooms[room] || 
           (Game.spawns[room] && Game.spawns[room].room) ||
           room;
    
    var energy = getEnergy(room, useOnlyPoweredExt);

    console.log('creating ' + bodyType);

    var body = bodies[bodyType](energy);

    console.log('    with body ' + JSON.stringify(body));

    memory = _.merge({ bodyType: bodyType }, memory);

    jobQueue.addBackgroundJob(room, new jobs.CreateCreep(body, memory));
}

var spawn = {
    upgrade: function(name) {
        var creep = Game.creeps[name];
        
        if(!creep) {
            console.log('unable to find creep ' + name);
            return;
        }
        
        var bodyType = creep.memory.bodyType;
        
        queueCreep(creep.room, false, bodyType, {job: new (require('job-replace'))(creep.name)});
    },
    leech: function(room, useOnlyPoweredExt) {
        queueCreep(room, useOnlyPoweredExt, 'leech', {need: 2, job: new (require('job-leech'))()});
    },
    runner: function(room, useOnlyPoweredExt) {
        queueCreep(room, useOnlyPoweredExt, 'runner', {job: new (require('job-runner'))()});
    },
    worker: function(room, useOnlyPoweredExt) {
        queueCreep(room, useOnlyPoweredExt, 'worker');
    },
    reservoir: function(room, structure, pos, useOnlyPoweredExt) {
        queueCreep(room, useOnlyPoweredExt, 'reservoir', {job: new (require('job-reservoir'))(structure, pos)});
    }
}

module.exports = spawn;