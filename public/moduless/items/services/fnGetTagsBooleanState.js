'use strict';

// function that checks the tags of an array of items. For each tag, returns 1 if all items have it, 0 if mixed
module.exports = function getTagsBooleanState (selectedItems, selectedTags) {
	
	var selectedItemsLength = selectedItems.length;
	
	for (var i=0, len=selectedTags.length; i<len;i++) {
		if (selectedTags[i].count === selectedItemsLength) {
			selectedTags[i].count = 1;
			selectedTags[i].newCount = 1;
		}
		else {
			selectedTags[i].count = 0;
			selectedTags[i].newCount = 0;
		}
	}
	
	return selectedTags;
	
};