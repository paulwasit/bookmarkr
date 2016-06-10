'use strict';

var pwArrayToggle =	require('../../_misc/pw-array-toggle'),
		getUniqueTags = require('./fnGetUniqueTags'),
		getNewBooleanState = require('./fnGetNewBooleanState'),
		getTagsBooleanState = require('./fnGetTagsBooleanState');
		
module.exports = function toggleItem (edit, items, itemID, fieldNames) {

	pwArrayToggle(edit.ids, itemID);
	if (edit.ids.length > 0) {
		var selectedItems = getSelectedItems (items, edit.ids, fieldNames.id),
				selectedTags = getUniqueTags (selectedItems, fieldNames.tags);
		edit.query = getNewBooleanState (selectedItems, [fieldNames.update.archived, fieldNames.update.inTrash, fieldNames.update.favorite, fieldNames.update.isPublic]);
		edit.tags = getTagsBooleanState (selectedItems, selectedTags);
	}
	else {
		return false;
	}

	return edit;
	
};


// function that retrieves the selected items of an object array based on their ID field
function getSelectedItems (items, selectedIDs, idFieldName) {
	
	var selectedItems = [];
	for (var i=0, len=items.length; i<len;i++) {
		if (selectedIDs.indexOf (items[i][idFieldName]) !==-1) {
			selectedItems.push (items[i]);
		}
	}
	
	return selectedItems;
	
};
