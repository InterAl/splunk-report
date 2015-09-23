var Q = require('q');
var searchJobCreator = require('./searchJobCreator.js');
var queryEvents = require('./queryEvents.js');
var queryJobStatus = require('./queryJobStatus.js');

var pollingFrequencyMs = 500;

function search(fromDate, toDate, searchString) {
    return searchJobCreator(fromDate, toDate, searchString)
    .then(function (sid) {
        return waitForJobCompletion(sid);
    }).then(function (sid) {
        console.log("job completed. querying events...");
        return queryEvents(sid);
    }).then(function(events) {
        console.log("fetched events.");
        return events;
    });
}

function waitForJobCompletion(sid) {
    function recur(defer) {
        console.log("polling job: ", sid);
        queryJobStatus(sid).then(function (result) {
            if (result.entry[0].content.isDone)
                defer.resolve(sid);
            else
                setTimeout(function() { recur(defer); }, pollingFrequencyMs);
        });
    }
    
    var deferred = Q.defer();

    recur(deferred);

    return deferred.promise;
}

module.exports = search;