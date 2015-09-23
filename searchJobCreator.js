var request = require("request");
//require("request-debug")(request);
var cfg = require('./config.js');
var Q = require("q");

module.exports = function(fromDate, toDate, searchString) {
    var deferred = Q.defer();

    var fromDateEpoch = fromDate.getTime() / 1000;
    var toDateEpoch = toDate.getTime() / 1000;
    var encodedSearchString = encodeURIComponent(searchString);

    request.post({
        url: 'https://splunk.etoro.com/en-US/splunkd/__raw/servicesNS/alonna/search/search/jobs',
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'X-Splunk-Form-Key': cfg.session.splunk.formKey,
            'Cookie': cfg.session.splunk.cookie,
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        body: 'rf=*&auto_cancel=30&status_buckets=300&output_mode=json&custom.search=' + encodedSearchString + '&search=search+' + encodedSearchString + '&earliest_time=' + fromDateEpoch+ '&latest_time=' + toDateEpoch + '&ui_dispatch_app=search&preview=0&adhoc_search_level=smart&indexedRealtime='        
    }, function (err, res, body) {
        if (err)
            return deferred.reject(err);

        if (res.statusCode != 201)
            return deferred.reject(res.statusCode);

        var parsedBody = JSON.parse(body);
        var sid = parsedBody.sid;
        deferred.resolve(sid);
    });

    return deferred.promise;
};