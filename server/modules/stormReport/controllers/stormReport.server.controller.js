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
	
	var aggregateFields = [];
	
	// aggregation query: add match filter if relevant
	if (typeof req.query.fields != "undefined") { aggregateFields.push({ $match: JSON.parse(req.query.fields) });	}
	
	// aggregation query: add grouping
	aggregateFields.push({ $group: { _id: "$State", stateName: { $first: "$stateName"}, totalHarm: { $sum: JSON.parse(req.query.harmType) } } });
	
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
	
	
