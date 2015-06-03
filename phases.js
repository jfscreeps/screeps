var checks = require('checks');
var jobQueue = require('jobQueue');

Game.cleanUp = [];

module.exports = {
    processDeaths: function() {},

    checkForNewJobs: function() {
        checks();
    },

    executeJobs: function() {
        for(var name in Game.creeps) {
        	var creep = Game.creeps[name];

            if(creep.spawning) continue;

        	creep.job = jobQueue.getCurrentJob(creep);

            if(creep.job)
            {
                creep.job.perform(creep);
            }
        }

        for(var name in Game.rooms)
        {
            var room = Game.rooms[name];

            var backgroundJob = jobQueue.getBackgroundJob(room);

            if(backgroundJob)
            {
                backgroundJob.perform(room);
            }
        }
    },

    cleanUp: function() {
        if(Game.cleanUp.length == 0) return;
        
        for(var i = 0; i < Game.cleanUp.length; i++) {
            tick.cleanUp[i]();
        }
    }
}