﻿var errorReportGen = require('./event-count-report/errorReportGen.js');

var fromDate = new Date(process.argv[2]);
var toDate = new Date(process.argv[3]);

if (toDate.toISOString() == fromDate.toISOString()) {
    toDate.setHours(23);
    toDate.setMinutes(59);
    toDate.setSeconds(59);
}

errorReportGen(fromDate, toDate).then(function(f) {
    console.log("Done!");
}).catch(function(err) {
    console.log("Failed!", err);
});