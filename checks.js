var checkRepair      = require('check-repair');
var checkBuild       = require('check-build');
var checkExtensions  = require('check-extensions');
var checkEndOfLife   = require('check-end-of-life');
var checkControllers = require('check-controller');
var checkLeeches     = require('check-leeches');
var checkFlags       = require('check-flags');

module.exports = function() {
    // checkRepair();
    checkBuild();
    checkExtensions();
    checkEndOfLife();
    // checkControllers();
    checkLeeches();
    checkFlags();
}