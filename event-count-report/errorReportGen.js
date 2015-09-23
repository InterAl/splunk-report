var Q = require("q");
var fs = require("fs");
var eventCountReportGen = require('./eventCountReportGen.js');
var newErrorEventsReportGen = require('./newErrorEventsReportGen.js');
var cfg = require('../config.js');

function generateReport(fromDate, toDate) {
    return Q.all([eventCountReportGen(fromDate, toDate),
                  newErrorEventsReportGen(fromDate, toDate)])
            .spread(function (countReport, newErrorsReport) {
                var countReportText = createTextualCountReport(countReport, fromDate, toDate, cfg.session.sourcetype);
                var newErrorsReportText = createTextualNewErrorsReport(newErrorsReport);
                return writeReportToFs(cfg.session.sourcetype, countReportText, newErrorsReportText);
            });
}

function getDate(date) {
    var d = date.toISOString();
    var i = d.indexOf("T");
    return d.substring(0, i);
}

function createTextualCountReport(countReport, fromDate, toDate, sourcetype) {
    var seed = "Error report for " + sourcetype + " for " + getDate(fromDate) + " - " + getDate(toDate) + "\r\n\r\n";

    var sortable = Object.keys(countReport).filter(function(k) {
        return countReport[k] > 0;
    }).map(function (k) {
        return [k, countReport[k]];
    });

    sortable.sort(function(a, b) { return b[1] - a[1]; });

    return sortable.reduce(function(p, c) {
        return p + c[1] + ": " + c[0] + "\r\n";
    }, seed);
}

function createTextualNewErrorsReport(newErrReport) {
    return newErrReport.reduce(function(p, c) {
        return p + c._raw.value + "\r\n";
    }, "");
}

function writeReportToFs(sourcetype, countReport, newErrorsReport) {
    var now = new Date();
    var dirName = "reports/" + sourcetype + " - " + now.toISOString().replace(/:/g, "-");

    return Q.nfcall(fs.mkdir, dirName).then(function() {
        return Q.all([Q.nfcall(fs.writeFile, dirName + "/" + "error-count.txt", countReport),
                      Q.nfcall(fs.writeFile, dirName + "/" + "new-errors.txt", newErrorsReport)]);
    });
}

module.exports = generateReport;