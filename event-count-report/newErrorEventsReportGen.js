var splunkSearcher = require('../splunkSearcher');
var cfg = require('../config');

function buildSearchString() {
    var searchSeed = "sourcetype=" + cfg.session.sourcetype + " " + cfg.session.errorIdentification;
    
    return cfg.events.reduce(function (p, c) {
        return p + " NOT \"" + c + "\"";
    }, searchSeed);
}

function getNewErrorEvents(fromDate, toDate) {
    var searchString = buildSearchString();
    return splunkSearcher(fromDate, toDate, searchString).then(function(result) {
        console.log("Fetched all new error events.");
        return result;
    });
}

module.exports = getNewErrorEvents;