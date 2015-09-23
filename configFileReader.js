var fs = require("fs");
var path = require('path');
var appDir = path.dirname(require.main.filename);
var Q = require('q');

module.exports = function(filename) {
    return fs.readFileSync(appDir + "/config/" + filename, 'utf8');
};