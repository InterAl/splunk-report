var errorReportGen = require('./event-count-report/errorReportGen.js');

var fromDate = new Date(process.argv[3]);
var toDate = new Date(process.argv[4]);

toDate.setHours(23);
toDate.setMinutes(59);
toDate.setSeconds(59);

errorReportGen(fromDate, toDate).then(function(f) {
    console.log("Done!");
}).catch(function(err) {
    console.log("Failed!", err);
});