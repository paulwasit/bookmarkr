'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  StormReport = mongoose.model('StormReport'),
	path = require('path'),
  errorHandler = require(path.resolve('./server/modules/core/controllers/errors.server.controller'));

/**
 * List of Events
 */
exports.list = function (req, res) {
	
	var harmType = JSON.parse(req.query.harmType),
			query = [],
			queryResults = {};
	
	// group by state
	addQuery (
		"statesMap",
		{ $group: { _id: "$stateName", totalHarm: { $sum: harmType } } },
		{ $sort:  { totalHarm: -1 } }
	);

	// group by year
	addQuery (
		"years",
		{ $group: { _id: "$year", totalHarm: { $sum: harmType } } },
		{ $sort:  { _id: 1 } }
	);
	
	// group by event types
	addQuery (
		"eventTypes",
		{ $group: { _id: harmType + "Top10", totalHarm: { $sum: harmType } } },
		{ $sort:  { totalHarm: -1 } }
	);
	
	
	// ---------- add match + run queries ---------- //
	
	// add match filter if needed
	if (typeof req.query.fields != "undefined") {
		var matchFields = JSON.parse(req.query.fields);
		for (var i=0, l=query.length; i<l; i++) { query[i].query.unshift({ $match: matchFields }); }
	}

	// run all queries
	var countdown = query.length,
			isError = false, errMsg = "";
	
	for (var i=0, l=query.length; i<l; i++) { 
		StormReport.aggregate(query[i].query, callback(query[i].chartName));
	}
	
	
	// ---------- internal functions ---------- //
	
	// add query
	function addQuery () {
		var newQuery = {
			chartName: arguments[0],
			query: []
		};
		for (var i = 1; i < arguments.length; i++) {
			newQuery.query.push(arguments[i]);
		}
		query.push(newQuery);
	}
	
	// callback after mongodb resolve
	function callback (propertyName) {
		return function (err, results) {
			if (err) {
				isError = true;
				errMsg = errMsg + '\n' + errorHandler.getErrorMessage(err);
			} else {
				queryResults[propertyName] = (JSON.stringify(results));
			}
			isDone();
		};
	}
	
	// return the results object once every callback is done
	function isDone () {
		countdown -=1;
		// all done, call exit
		if (countdown == 0) {
			if (isError === true) return res.status(400).send({ message: errMsg });
			res.status(200).json(queryResults);
		};
	}
	
};

/*
exports.harmTypeSwitch = function (req, res) {

	var top10;
	
	switch(req.params.harmTypeSwitch) {
		case "cropDmg":
			top10 = ["DROUGHT", "EXTREME COLD/WIND CHILL", "FLASH FLOOD", "FLOOD", "FROST/FREEZE", "HAIL", "HURRICANE/TYPHOON", "ICE STORM", "THUNDERSTORM WIND", "OTHER"];
			break;
		case "propDmg":
			top10 = ["FLASH FLOOD", "FLOOD", "HAIL", "HURRICANE/TYPHOON", "STORM SURGE/TIDE", "THUNDERSTORM WIND", "TORNADO", "TROPICAL STORM", "WILDFIRE", "OTHER"];
			break;
		case "Injuries":
			top10 = ["EXCESSIVE HEAT", "FLASH FLOOD", "FLOOD", "HEAT", "ICE STORM", "LIGHTNING", "THUNDERSTORM WIND", "TORNADO", "WILDFIRE", "OTHER"];
			break;
		default:
			top10 = ["EXCESSIVE HEAT", "EXTREME COLD/WIND CHILL", "FLASH FLOOD", "FLOOD", "HEAT", "LIGHTNING", "RIP CURRENT", "THUNDERSTORM WIND", "TORNADO", "OTHER"];
	}
	
	res.json(top10);

	// execute aggregate query
	//var query = StormReport.aggregate(aggregateFields);
	
	var query = StormReport.distinct(req.params.harmTypeSwitch + "Top10");
  query.exec(function (err, results) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(results);
    }
  });

};
*/
	
	
