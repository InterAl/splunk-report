var splunkSearcher = require('../splunkSearcher');
var cfg = require('../config');
var Q = require("q");

function buildEventCountSearchString(sourcetype, event) {
    return "sourcetype=" + sourcetype + " " + cfg.session.errorIdentification  + " \"" + event + "\"";
}

function getEventsCount(fromDate, toDate) {
    var searchStrings = cfg.events.map(function (event) {
        return buildEventCountSearchString(cfg.session.sourcetype, event);
    });

    var searchPromises = searchStrings.map(function(searchString) {
        return splunkSearcher(fromDate, toDate, searchString);
    });

    return Q.all(searchPromises).then(function (results) {
        return results.reduce(function(p, c, i) {
            var searchString = searchStrings[i];
            p[searchString] = c.length;
            return p;
        }, {});
    });
}

module.exports = getEventsCount;