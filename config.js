var configFileReader = require("./configFileReader.js");
var Q = require("Q");

function parseEventsFile(data) {
    return data.split("\r\n");
}

function parseConfigFile(cfg) {
    return JSON.parse(cfg);
}

var srcCfgDir = process.argv[2];

var eventsData = configFileReader(srcCfgDir + "/events.cfg.txt");
var configData = configFileReader(srcCfgDir + "/config.json");

var events = parseEventsFile(eventsData);
var cfg = parseConfigFile(configData);

module.exports = {
    events: events,
    session: cfg
};