var registrations = {};

module.exports = {
    registerJobType: function(type, ctor){
        registrations[type] = ctor;
    },
    getJobFromDef: function(def) {
        if(!registrations.hasOwnProperty(def.type))
        {
            return null;
        }

        return registrations[def.type](def);
    }
};