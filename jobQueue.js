var jobber = require('jobRegistry');
var utils = require('utils');

function getJobs(room){
    if(!room.memory.jobs)
    {
        room.memory.jobs = {};
        room.memory.jobIndex = 0;
    }
    
    return room.memory.jobs;
}

function getBackgroundJobs(room){
    if(!room.memory.backgroundJobs)
    {
        room.memory.backgroundJobs = [];
    }
    
    return room.memory.backgroundJobs;
}

function getJobsInPriorityOrder(room)
{
    return _(getJobs(room))
        .omit(_.property('assigned'))
        .pairs()
        .sortBy('[1].priority')
        .reverse()
        .value();
}

function getCurrentJobDef(creep) {
    if(!creep.memory.job)
    {
        giveCreepNewJob(creep);
    }
    
    if(creep.memory.job)
    {
        var jobs = getJobs(creep.room);
        
        var job = jobs[creep.memory.job] && jobs[creep.memory.job].job;
        
        return job || creep.memory.job;
    }
}

function giveCreepNewJob(creep) {
    var jobs = getJobsInPriorityOrder(creep.room);

    var job;
    var jobKey;
    for(var i in jobs) {
        job = jobs[i][1];

        if(job && utils.meetsRequirements(creep, job.requirements)) {
            jobKey = jobs[i][0];
            break;
        }
    }

    if(jobKey) {
        var def = job;
        def.assigned = creep.name;
        creep.memory.job = jobKey;
        creep.say(def.type);
    }
}

var queue = {
    addJob: function(room, job, requirements, position, priority, creep) {
        var jobs = getJobs(room);

        var index = room.memory.jobIndex++;

        var key = 'job_' + index;

        jobs[key] = {
            job: job,
            type: job.type,
            requirements: requirements,
            position: position,
            priority: priority,
            assigned: undefined
        };

        if(creep) {
            creep.memory.job = key;
            jobs[key].assigned = true;
        }
    },
    
    jobExists: function(room, job) {
        var jobs = getJobs(room);

        job = _.extend({}, job);

        var result = _.any(jobs, {job: job});
        
        return result;
    },
    
    jobComplete: function(creep) {
        if(creep.memory.job)
        {
            var jobs = getJobs(creep.room);
    
            var job = jobs[creep.memory.job];
    
            delete jobs[creep.memory.job];
            
            creep.memory.job = undefined;
        }
    },
    
    unassign: function(creep) {
        if(creep.memory.job)
        {
            var jobs = getJobs(creep.room);

            var job = jobs[creep.memory.job];
    
            if(job) {
                job.assigned = undefined;
            }
            else{
              console.log('unable to find job to unassign: ' + creep.memory.job);
              console.log(JSON.stringify(jobs, null, 4));
            } 
        }
    },
    
    getCurrentJob: function(creep) {
        var def = getCurrentJobDef(creep);
        
        if(def == null) return null;
        
        var job = jobber.getJobFromDef(def);
        
        if(job == null) {
            console.log('removing job ' + JSON.stringify(def));
            delete creep.room.memory.jobs[creep.memory.job];
            creep.memory.job = undefined;
        }
        
        return job;
    },
    
    addBackgroundJob: function(room, job) {
        var jobs = getBackgroundJobs(room);

        jobs.push({
            job: job,
            type: job.type
        });
    },
    
    getBackgroundJob: function(room) {
        var jobs = getBackgroundJobs(room);
        
        var def = jobs.shift();
        
        return def && jobber.getJobFromDef(def.job);
    }
};

module.exports = queue;