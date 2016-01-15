'use strict';


/* ------------------------------ Module dependencies ---------------------------------- */
 
//modules used in the routes handling
var mongoose = require('mongoose'),
		Show = mongoose.model('Show');
		
/* ------------------------------ GET shows list --------------------------------------- */

exports.list = function(req, res, next) {

	var queryFields = JSON.parse(req.query.fields);
	queryFields.user = req.user._id;
	
	var query = Show.aggregate()
	.match(queryFields)
	.project({
		_id:0,
		genre:'$genre',
		count:{ $add:1 }
	})
	.unwind('genre')
	.group({ _id: '$genre', count: { $sum: '$count' } })
	.sort({ _id: 1 });
	
	query.exec(function (err, genres) {
		if (err) return next(err);
		return res.json(genres);
	});
		
};  