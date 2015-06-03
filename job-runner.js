var jobber = require('jobRegistry');
var utils = require('utils');

function RunnerJob(leech) {
    this.type = 'RunnerJob';
    this.leech = leech;
}

RunnerJob.prototype.perform = function(creep) {
    if(creep.memory.mode == 'return') {
        utils.depositEnergy(creep);
        
        if(creep.energy == 0) {
            creep.memory.mode = 'collect';
        }
    }
    else {
        utils.pickupDroppedEnergy(creep)
        
        var leech = this.getLeech(creep);
        
        if(creep.pos.isNearTo(leech)){
            leech.transferEnergy(creep);

            if(creep.energy == creep.energyCapacity) {
                creep.memory.mode = 'return';
            }
        }
        else {
            creep.moveTo(leech);
        }
    }
}

RunnerJob.prototype.getLeech = function(creep) {    
    var leech = Game.creeps[this.leech]

    if(!leech)
    {
        var results = creep.room.find(FIND_MY_CREEPS, {filter: {memory: {bodyType: 'leech'}}});
    
        for(var i in results) {
            var c = results[i];

            if(c.memory.need > 0 || c.memory.need === undefined) {
                console.log('attaching ' + creep.name + ' to ' + c.name);
                console.log(c.memory.need);
                
                c.memory.need = (c.memory.need || 1) - 1;

                this.leech = c.name;
                
                creep.memory.job = this;

                return c;
            }
        };
    }
    
    return Game.creeps[this.leech]
}

module.exports = RunnerJob;

jobber.registerJobType('RunnerJob', function(def) { 
    return new RunnerJob(def.leech);
});