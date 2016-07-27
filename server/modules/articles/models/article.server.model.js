'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Article Schema
 */
var ArticleSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  title: {
    type: String,
    default: '',
    trim: true,
    required: 'Title cannot be blank'
  },
	url: {
		type: String,
    default: ''
	},
	imgUrl: {
		type: String,
    default: './modules/_layout/assets/img/pw-ds.png'
	},
  content: [{
		title: {
			type: String,
			trim: true,
			default: 'tab1'
		},
		body: {
			type: String,
			trim: true
		}
	}],
	content2: [{
		title: {
			type: String,
			trim: true
		},
		body: {
			type: String,
			trim: true
		}
	}],
	collectionTag: {
		type: String,
		default: 'misc'
	},
	tags: [{
    type: [String],
    trim: true
  }],
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
	index: {
		type: Number,
		default: 999999
	},
	isSlide: {
		type: Boolean,
		default: false
	},
	isPublic: {
		type: Boolean,
		default: false
	},
	favorite: {
		type: Boolean,
		default: false
	},
	archived: {
		type: Boolean,
		default: false
	},
	inTrash: {
		type: Boolean,
		default: false
	}
});

mongoose.model('Article', ArticleSchema);
