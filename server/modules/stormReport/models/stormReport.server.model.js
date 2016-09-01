'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * StormReport Schema
 */
var StormReportSchema = new Schema({
	
	year					 : Number, 
	State					 : String, 
	stateName      : String,

	LATITUDE       : Number,
	LONGITUDE      : Number,
	
	Event_Type		 : String,
	Fatalities     : Number,
	Injuries       : Number,
	propDmg        : Number,
	cropDmg        : Number,

	FatalitiesTop10: String,
	InjuriesTop10  : String,
	propDmgTop10   : String,
	cropDmgTop10   : String
	
	

},{collection: 'stormReport'});

mongoose.model('StormReport', StormReportSchema);
