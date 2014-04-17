var express = require('express');
var router = express.Router();
var http = require('http');
var parseString = require('xml2js').parseString;

var getBuildStatus = function () {
    // console.log('make the request');
    http.get('http://dpavao:password-here@astonishdev.net:8085/bamboo/rest/api/latest/result?os_authType=basic', function (res) {
	var xmlStr = '';
 	// console.log('request is back');
	res.on('data', function (chunk) {
	    // console.log('chunk');
	    xmlStr += chunk;
	});

	res.on('end', function () {
	    parseString(xmlStr, function (err, result) {
		if (err) throw(err);
		// console.log('plan: ', result.results.results[0].result[0].$.key, 'was', result.results.results[0].result[0].$.state);

		var plan;
		var keyArr;
		for (var i = 0; i < result.results.results[0].result.length; i++) {
		    plan = result.results.results[0].result[i];
		    keyArr = plan.$.key.split('-');
		    keyArr.pop();
		    app.set(keyArr.join('-'), plan.$.state.charAt(0).toLowerCase());
		    console.log('plan: ', keyArr.join('-'), 'was', plan.$.state);
		};
		// app.set(result.results.results[0].result[0].$.key, result.results.results[0].result[0].$.state);
		setTimeout(timeoutFn, 5000);
	    });
	});
    });
};

var timeoutFn = function () {
    getBuildStatus();
    // console.log('build-status', app.get('build-status'));
};

setTimeout(timeoutFn, 5000);


/* GET home page. */
router.get('/', function(req, res) {
    res.send(JSON.stringify({status: 'ok'}));
});

router.get('/build-status/:plan', function (req, res) {
    res.send(app.get(req.params.plan));
});

module.exports = router;
