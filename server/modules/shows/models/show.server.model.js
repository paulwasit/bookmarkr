var mongoose = require('mongoose');
var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
		
// the schema follows the structure of http://thetvdb.com/
var showSchema = new mongoose.Schema(
	{
		seriesId: Number,
		name: String,
		airsDayOfWeek: String,
		airsTime: String,
		firstAired: Date,
		genre: [String],
		network: String,
		overview: String,
		rating: Number,
		ratingCount: Number,
		runtime: String,
		status: String,
		poster: String,
		thumb: String,
		user: mongoose.Schema.ObjectId,
		subscribers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
		seasons: [Number],
		numberOfSeasons: Number,
		episodes: [{
			season: Number,
			episodeNumber: Number,
			episodeName: String,
			firstAired: Date,
			overview: String
		}],
		numberOfEpisodes: Number,
		favorite: Boolean,
		archived: Boolean,
		inTrash: Boolean
	},
	{ collection: 'shows' }
);

module.exports = mongoose.model('Show', showSchema); // schema passed to the mongoose.model method
