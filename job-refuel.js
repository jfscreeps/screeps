var utils = require('utils');

function Refuel() {
    this.type = 'refuel';
}

Refuel.prototype.perform = function(creep) {
    
    if(creep.energy > 50) {
    	creep.memory.job = undefined;
    	return;
    }
    
    utils.collectEnergy(creep);

}

module.exports = Refuel;