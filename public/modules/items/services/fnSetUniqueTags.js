'use strict';

// Update the tag list w/ tag count
// Returns an array of objects (key/values = tagName/tagCount)

module.exports = function setUniqueTags (items, tagFieldName) {
	
	var tags = [], 
			uniqueTags;
	
	// complete list of tags, incl. several occurrences
	for ( var i=0, len=items.length; i<len; i++ ) {
		tags = tags.concat( items[i][tagFieldName] );
	}
	
	// unique tags object
	uniqueTags = tags.reduce( function( prev, curr ) {
		prev[curr] ? prev[curr]++ : prev[curr] = 1;
		return prev;
	}, {});
	
	// unique tags array of objects (key/values = tagName/tagCount)
	uniqueTags = Object.keys(uniqueTags).map ( function( key ) {
		var obj = {};
		obj.name = key;
		obj.count = uniqueTags[key];
		return obj; 
	});
	
	return uniqueTags;
	
};