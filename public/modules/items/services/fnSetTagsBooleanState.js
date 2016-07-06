'use strict';

// Update the status of each tag for selected items
// Returns 1 if all selected items have the tag, 0 otherwise

// function that checks the tags of an array of items. For each tag, returns 1 if all items have it, 0 if mixed
module.exports = function setTagsBooleanStates (selectedItems, selectedTags) {
	
	var selectedItemsLength = selectedItems.length;
	
	for (var i=0, len=selectedTags.length; i<len;i++) {
		
		selectedTags[i].count = (selectedTags[i].count === selectedItemsLength) ? 1 : 0;
		selectedTags[i].newCount = angular.copy(selectedTags[i].count);
		
	}
	
	return selectedTags;
	
};