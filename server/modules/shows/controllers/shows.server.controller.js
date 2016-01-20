'use strict';


/* ------------------------------ Module dependencies ---------------------------------- */
 
//modules used in the routes handling
var mongoose = require('mongoose'),
    Show = mongoose.model('Show'),
    fs = require('fs'),
    gm = require('gm').subClass({ imageMagick: true }),
    _ = require('lodash'),		  // see https://lodash.com/docs

//modules used in the POST handling
   async = require('async'),       // see https://github.com/caolan/async#waterfalltasks-callback
   request = require('request'),  // see https://www.npmjs.org/package/request
   xml2js = require('xml2js'),   // see https://github.com/Leonidas-from-XIV/node-xml2js
   img_path='./public/modules/shows/assets/img/';

/* ------------------------------ GET shows list --------------------------------------- */

exports.list = function(req, res, next) {
	
	var queryFields = {};
	queryFields = JSON.parse(req.query.fields);
	queryFields.user = req.user._id;
	
	//no filter for the query - only certain fields are returned
	var query = Show.find (queryFields, {
		seriesId: 1,
		name: 1,
		rating: 1,
		status: 1,
		airsDayOfWeek: 1,
		airsTime: 1,
		network: 1,
		thumb: 1,
		genre: 1,
		numberOfSeasons: 1,
		numberOfEpisodes: 1,
		archived: 1,
		favorite: 1,
		inTrash: 1
	}); 
	
	query.exec(function (err, shows) {
		if (err) return next(err);
		return res.json(shows);
	});
	
};

/* ------------------------------ GET the current show --------------------------------- */

exports.read = function(req, res, next) {
	
	var query = Show.findById(req.params.id);
	
	query.exec(function (err, show) {
		if (err) return next(err);
		if (show === null) return res.json(false);
		res.json(show);
	});

};

/* ------------------------------ PUT an array of existing shows ----------------------- */

exports.update = function(req, res, next) {
	
	if (Object.getOwnPropertyNames(req.query).length > 0) {
		var query = JSON.parse(req.query.fields);
		var shows = JSON.parse(req.body.shows);
	}
	else {
		var shows = [];
		shows.push(req.body._id);
		var query = {genre: req.body.genre};
	}
	
	Show.update(
		{ _id: { $in: shows } }, 
		{ $set: query }, 
		{ multi: true },
		function (err, numAffected) {
			if (err) return next(err);
			console.log(numAffected + ' doc updated');
			return res.status(200).json(req.body);
		}
	);
	
};

/* ------------------------------ DEL an article --------------------------------------- */
// requires a logged user w/ authorization
exports.delete = function(req, res, next) {
	
	var query = JSON.parse(req.query.fields),
			shows = JSON.parse(req.query.shows);

	query.user = req.user._id;
	if (shows.length > 0) {
		query._id = { $in: shows };
	}
	
	query = Show.remove(query);
	
	query.exec(function (err) {
		if (err) return next(err);
		return res.status(200).send('DB successfully updated. ' + shows.length + ' successfully removed.');
	});
	
};

/* ------------------------------ POST a new show -------------------------------------- */

exports.create = function(req, res, next) {
	
	console.log('ok');
	var apiKey = '9EF1D1E7D28FDA0B';
	
	var parser = xml2js.Parser({
		explicitArray: false,
		normalizeTags: true
	});
	
	/* regexp always start & end with '/' ; the characters after the ending '/' are flags. g means global search through the entire string
	/* '/ /g' = all ' '
	/* '/[^\w-]+/g' = all the characters outside [^...] will be replaced by ''. '\w' indicates all letters & numbers. '+' indicates all occurences of [^...].
	/* see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions */
		
	// ' ' is replaced by '_' and all characters that are neither letters nor numbers nor '-' nor '_' are removed
	var seriesName = req.body.showName
		.toLowerCase()
		.replace(/ /g, '_') 	      
		.replace(/[^\w-]+/g, '');	
		
	if (!req.user) return res.status(401).send('No user');
	var userId = req.user._id;
		
	async.waterfall([
			
		// first function, that passes the seriesId of its callback to the next function
		function(callback) {
			
			// response = http server response ¤ body = the requested web page (note: the /api/ link ensures that the web page is an xml file)
			request.get('http://thetvdb.com/api/GetSeries.php?seriesname=' + seriesName, function(error, response, body) {
					
				if (error) return next(error);
				parser.parseString(body, function(err, result) {
						
					if (!result.data) {
						return res.status(404).send({ message: 'Please type a series name.' });
					}
					
					if (!result.data.series) {
						return res.status(404).send({ message: req.body.showName + ' was not found.' });
					}
					
					if (result.data.series instanceof Array && req.body.isUnique === false) {
						return res.status(310).send({ message: 'Multiple choices for this name.', series: result.data.series });
					}
					
					var seriesId = result.data.series.seriesid || result.data.series[0].seriesid;
					callback(err, seriesId);
					
				});
			});
			
		},
		
		// if only one match: check if the serie is already in the DB. If not, go to next function.
		// If yes & the user has not yet subscribed to it, then we do it. Otherwise, error msg
		function(seriesId, callback) {
			
			var query = Show.find({ seriesId: seriesId, user: userId });
			//Show.findById(seriesId);

			query.exec(function (err, show) {
				
				if (err) return next(err);

				if (show.length > 0) {
					return res.status(409).send({ message: show[0].name + ' already exists !' });
				}
				
				callback(err, seriesId);
			
			});
			
		},
		
		// second function, that takes the seriesId of the previous callback & passes the show of its callback to the next function
		function(seriesId, callback) {
			
			request.get('http://thetvdb.com/api/' + apiKey + '/series/' + seriesId + '/all/en.xml', function(error, response, body) {
					
				if (error) return next(error);
				parser.parseString(body, function(err, result) {
						
					// the filter keeps only fields compatible with the genre type 
					var series = result.data.series;
					var episodes = result.data.episode;
					var show = new Show({
						seriesId: series.id,
						name: series.seriesname,
						airsDayOfWeek: series.airs_dayofweek,
						airsTime: series.airs_time,
						firstAired: series.firstaired,
						genre: series.genre.split('|').filter(Boolean),
						network: series.network,
						overview: series.overview,
						rating: series.rating,
						ratingCount: series.ratingcount,
						runtime: series.runtime,
						status: series.status,
						poster: series.poster,
						//thumb,
						user: userId,
						//subscribers,
						//seasons,
						//numberOfSeasons,
						episodes: [],
						//numberOfEpisodes,
						favorite: false,
						archived: false,
						inTrash: false
					});
					
					// add user to the subscribers
					// show.user.push(userId);
					
					//uses lodash: for each 'episode' of the collection 'episodes'
					show.numberOfEpisodes = 0;
					
					_.each(episodes, function(episode) {	
						if (show.seasons.indexOf(episode.seasonnumber) === -1) show.seasons.push(episode.seasonnumber);
						show.episodes.push({
							season: episode.seasonnumber,
							episodeNumber: episode.episodenumber,
							episodeName: episode.episodename,
							firstAired: episode.firstaired,
							overview: episode.overview
						});
						
						if (episode.seasonnumber > 0) {
							show.numberOfEpisodes += 1;
						}
					});
					
					show.numberOfSeasons = Math.max.apply(Math, show.seasons);
					callback(err, show);
				
				});
			});
		},
		
		// third function, that takes the show of the previous callback & passes the show of its callback to the next function
		function(show, callback) {
				
			// transforms the image in a base64 string that can be inserted directly in a html. see http://en.wikipedia.org/wiki/Data_URI_scheme
			var url = 'http://thetvdb.com/banners/' + show.poster;
			request({ url: url, encoding: 'binary' }, function(error, response, body) {
				// converts a base64 img into jpeg
				//var img = new Buffer(shows[i].poster, 'base64');
				fs.writeFileSync(img_path + show._id + '.jpg', body, 'binary');
				gm(img_path + show._id + '.jpg').resize(200).crop('200','200').write(img_path + show._id + '_thumb.jpg', function (err) {
					if (err) console.log('resize fail: ' + err);
				});
				
				show.poster = 'modules/shows/assets/img/' + show._id + '.jpg';
				show.thumb = 'modules/shows/assets/img/' + show._id + '_thumb.jpg';
				
				// show.poster = body.toString('base64');
				callback(error, show);
				
			});
		}
		
	], 
		
	// all functions are called, the show is the result of the last function's callback
	function(err, show) {
		
		if (err) return next(err);
		show.save(function(err) {
			if (err) {
				if (err.code === 11000) {
					return res.status(409).send({ message: show.name + ' already exists !' });
				}
				return next(err);
			}
			return res.status(200).send({ message: show.name + ' successfully added.' });
			
		});
	});

};
