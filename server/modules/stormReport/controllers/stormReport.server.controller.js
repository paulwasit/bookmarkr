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
	
	var aggregateFieldsA = [],
			aggregateFieldsB = [],
			aggregateFieldsC = [],
			queryResults = [];
		
	// aggregation query: add match filter if relevant
	if (typeof req.query.fields != "undefined") { 
		aggregateFieldsA.push({ $match: JSON.parse(req.query.fields) });	
		aggregateFieldsB.push({ $match: JSON.parse(req.query.fields) });	
		aggregateFieldsC.push({ $match: JSON.parse(req.query.fields) });	
	}
	
	// aggregation query: add grouping
	aggregateFieldsA.push({ $group: { _id: "$State", stateName: { $first: "$stateName"}, totalHarm: { $sum: JSON.parse(req.query.harmType) } } });
	
	// track callbacks of all aggregate functions;
	var countdown = 1;
	var isDone = function () {
		countdown -=1;
		// all done, call exit
		if (countdown == 0) {
			if (isError === true) return res.status(400).send({ message: errMsg });
			res.status(200).json(queryResults);
		};
	}
	
	
	// execute aggregate queries
	var isError = false, errMsg = "";
	var queryA = StormReport.aggregate(aggregateFieldsA);
  queryA.exec(function (err, results) {
    if (err) {
			isError = true;
			errMsg = errMsg + '\n' + errorHandler.getErrorMessage(err);
    } else {
      queryResults.push(JSON.stringify(results));
    }
		isDone();
  });
	
};

exports.harmTypeSwitch = function (req, res) {
	
	var aggregateFields = [{ $group: { _id: "$" + req.params.harmTypeSwitch + "Top10" } }];
	
	// execute aggregate query
	var query = StormReport.aggregate(aggregateFields);
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
	
	
