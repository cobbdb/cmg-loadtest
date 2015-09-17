var fs = require('fs'),
    keys = require('./keys.json').keys,
    WebPageTest = require('webpagetest'),
    concurrency = 8,
    runsPerDay = 195 * keys.length / concurrency,
    msPerDay = 24 * 60 * 60 * 1000,
    msPerRun = msPerDay / runsPerDay,
    i = 0,
    logRetention = 2;

global.setInterval(function () {
    var wpt = new WebPageTest('www.webpagetest.org', keys[i]);
    wpt.runTest('http://www.atlantacmgsite.com', {
        runs: concurrency
    }, function (err, data) {
        var now = new Date(),
            msg = '\t' + now + '\n' + global.JSON.stringify(err || data) + '\n\n',
            newLog = (i % (keys.length * logRetention)) === 0;
        if (newLog) {
            fs.writeFile('results.log', msg, function (err) {});
        } else {
            fs.appendFile('results.log', msg, function (err) {});
        }
    });

    i += 1;
    i %= keys.length;
}, msPerRun);
