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
	tags: [{
    type: String,
    trim: true
  }],
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
	index: {
		type: Number,
		default: 999999
	}
	,
	isPublic: {
		type: Boolean,
		default: false
	}
});

mongoose.model('Article', ArticleSchema);
