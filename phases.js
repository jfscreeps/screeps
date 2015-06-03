var tick = require('tick');

module.exports = {
    processDeaths: function() {},

    checkForNewJobs: function() {
        require('checks');
    },

    executeJobs: function() {
        var leech = require('leech');
        var jobQueue = require('jobQueue');
        
        require('jobs');
        
        for(var name in Game.creeps) {
        	var creep = Game.creeps[name];
        
            if(creep.spawning) continue;

        	var job = jobQueue.getCurrentJob(creep);

            if(job)
            {
                job.perform(creep);
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
        if(!tick.cleanUp || tick.cleanUp.length == 0) return;
        
        for(var i = 0; i < tick.cleanUp.length; i++) {
            tick.cleanUp[i]();
        }
    }
}