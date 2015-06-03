var partEnergy = {};

partEnergy[MOVE] = 50;
partEnergy[WORK] = 100;
partEnergy[CARRY] = 50;
partEnergy[ATTACK] = 80;
partEnergy[RANGED_ATTACK] = 150;
partEnergy[HEAL] = 200;
partEnergy[TOUGH] = 20;

module.exports = {
    reservoir: function(energy) {
        var init = [MOVE];
        
        var mix = _.object([[CARRY, 1]]);

        return createBody(init, mix, energy, 999);
    },
    runner: function(energy) {
        var mix = _.object([[CARRY, 1],[MOVE, 1]]);

        return createBody([], mix, energy, 8);
    },
    leech: function(energy) {
        var init = [WORK, CARRY, MOVE];
        
        var mix = _.object([[WORK, 5],[CARRY, 2],[MOVE, 1]]);

        return createBody(init, mix, energy, 16);
    },
    worker: function(energy) {
        var init = [WORK, CARRY, CARRY, MOVE];
        
        var mix = _.object([[WORK, 1],[CARRY, 3],[MOVE, 4]]);

        return createBody(init, mix, energy, 16);
    }
}

function addPart(body, part) {
    body.push(part);
    
    return partEnergy[part];
}

function getCost(body) {
    var total = 0;
    
    for(var i in body) {
        total += partEnergy[body[i]];
    }
    
    return total;
}

function createBody(init, mix, energy, maxParts) {
    var result = init;

    console.log(total);
    
    var current = _.transform(_.groupBy(init, _.identity), function(result, n, key) {
      result[key] = n.length;
    });
    
    var total = _.sum(_.values(mix));
    var currentTotal = _.sum(_.values(current));
    var currentEnergy = getCost(init);
    
    mix = _.mapValues(mix, function(m){ return m/total; });
    
    while(true) {
        var nextPart = _.findKey(mix, function(m, part) { return !current[part] || (current[part] / currentTotal) < m; }) || _.first(_.keys(mix));
        var cost = partEnergy[nextPart];
        
        if(currentEnergy + cost <= energy && currentTotal < maxParts) {
            result.push(nextPart);
            current[nextPart] = current[nextPart] ? current[nextPart] + 1 : 1;
            currentTotal++;
            currentEnergy += cost;
        }
        else {
            return result;
        }
    }
}





