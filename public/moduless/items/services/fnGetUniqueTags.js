'use strict';

module.exports = function getUniqueTags (items, tagFieldName) {
	
	// we loop through the items to get an object with key/values = tagName/tagCount
	var uniqueTags = {};
	for (var i=0, len=items.length; i<len;i++) {
		
		var itemTags = items[i][tagFieldName];					
		for (var j=0, len2=itemTags.length; j<len2;j++) {
			if (!uniqueTags[itemTags[j]]) {
				uniqueTags[itemTags[j]] = 1;
			}
			else {
				uniqueTags[itemTags[j]] = uniqueTags[itemTags[j]] + 1;
			}
		}
		
	}

	// we transform the object into an array of objects {name: tagName, count: tagCount}: one for each tag
	uniqueTags = Object.keys(uniqueTags).map (function(key) {
		var obj = {};
		obj.name = key;
		obj.count = uniqueTags[key];
		return obj; 
	});
	
	return uniqueTags;
	
};