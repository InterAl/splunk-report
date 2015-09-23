var request = require("request");
var cfg = require('./config.js');
var Q = require("q");

module.exports = function(sid) {
    var deferred = Q.defer();
    
    request.get({
        url: 'https://splunk.etoro.com/en-US/splunkd/__raw/servicesNS/nobody/search/search/jobs/' + sid + '?output_mode=json&_=1442945867392',
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'X-Splunk-Form-Key': cfg.session.splunk.formKey,
            'Cookie': cfg.session.splunk.cookie,
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        }
    }, function (err, res, body) {
        if (err)
            return deferred.reject(err);

        var parsedBody = JSON.parse(body);

        return deferred.resolve(parsedBody);
    });

    return deferred.promise;
};