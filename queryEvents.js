var request = require("request");
var cfg = require('./config.js');
var Q = require("q");

var maxEventsCount = 99999999;

module.exports = function(sid) {
    var deferred = Q.defer();
    
    request.get({
        url: 'https://splunk.etoro.com/en-US/splunkd/__raw/servicesNS/nobody/search/search/jobs/' + sid + '/events?output_mode=json&offset=0&count=' + maxEventsCount + '&segmentation=full&max_lines=5&field_list=host%2Csource%2Csourcetype%2C_raw%2C_time%2C_audit%2C_decoration%2Ceventtype%2Clinecount%2C_fulllinecount%2C_icon&truncation_mode=abstract&_=1442932072023',
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

        return deferred.resolve(parsedBody.results);
    });

    return deferred.promise;
};