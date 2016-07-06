'use strict';

var pwArrayToggle =	require('../../_misc/pw-array-toggle'),
		setUniqueTags = require('./fnSetUniqueTags'),
		setNewBooleanStates = require('./fnSetNewBooleanStates'),
		setTagsBooleanState = require('./fnSetTagsBooleanState');
		
module.exports = function toggleItem (edit, items, itemID, fieldNames) {

	pwArrayToggle(edit.ids, itemID);
	if (edit.ids.length > 0) {
		var selectedItems = getSelectedItems (items, edit.ids, fieldNames.id),
				selectedTags  = setUniqueTags (selectedItems, fieldNames.tags);
		edit.query = setNewBooleanStates (selectedItems, fieldNames.update);
		edit.tags  = setTagsBooleanState (selectedItems, selectedTags);
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
