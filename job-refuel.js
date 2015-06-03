var jobber = require('jobRegistry');
var utils = require('utils');

function RefuelJob() {
    this.type = 'RefuelJob';
}

RefuelJob.prototype.perform = function(creep) {
    
    if(creep.energy > 50) {
    	creep.memory.job = undefined;
    	return;
    }
    
    utils.collectEnergy(creep);

}

module.exports = RefuelJob;

jobber.registerJobType('RefuelJob', function(def) { 
    return new RefuelJob();
});