var jobber = require('jobRegistry');
var utils = require('utils');

function getSource(leech){
    if(leech.memory.source){
    	var results = leech.room.find(FIND_SOURCES, {filter:{id:leech.memory.source}});
    	
    	return results.length > 0 ? results[0] : null;
    }

	var leeches = leech.room.find(FIND_MY_CREEPS, {filter:{memory:{bodyType: 'leech'}}});
	var taken = _.map(leeches, function(x){ return x.memory.source; });

	var source = leech.pos.findClosest(FIND_SOURCES, {filter: function(s) {
	    if(_.contains(taken, s.id)) return false;

	    var killer = s.pos.findInRange(FIND_HOSTILE_STRUCTURES, 5, {filter: {structureType: STRUCTURE_KEEPER_LAIR}});

	    return killer.length == 0;
	}});

	leech.memory.source = source && source.id;
	
	return source;
}

function Leech() {
    this.type = 'Leech';
}

Leech.prototype.perform = function(creep) {
    
    var source = getSource(creep);
    
    if(creep.energy < creep.energyCapacity) {
        creep.moveTo(source);
        creep.harvest(source);
    }
    else if(creep.memory.need > 0) {
        var runners = creep.room.find(FIND_MY_CREEPS, {filter:{memory:{bodyType:'runner', job:{leech: creep.name}}}});
        
        if(runners.length == 0) {
            creep.say('no runner');
            
            utils.depositEnergy(creep);
        }
    }

}

module.exports = Leech;

jobber.registerJobType('Leech', function(def) { 
    return new Leech();
});