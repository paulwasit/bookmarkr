'use strict';

angular.module('shows')
.service('itemUpdate', [function () {
	
  // function that pushes tags into an array of objects {name: tagName, count: tagCount}
	this.getUniqueTags = function (items, itemTagsName) {
		
		var uniqueTags = {};
		for (var i=0, len=items.length; i<len;i++) {
			
			var itemTags = items[i][itemTagsName];					
			for (var j=0, len2=itemTags.length; j<len2;j++) {
				if (!uniqueTags[itemTags[j]]) {
					uniqueTags[itemTags[j]] = 1;
				}
				else {
					uniqueTags[itemTags[j]] = uniqueTags[itemTags[j]] + 1;
				}
			}
			
		}

		// we transform the object into an array of objects: one for each tag
		uniqueTags = Object.keys(uniqueTags).map (function(key) { 
			var obj = {};
			obj.name = key;
			obj.count = uniqueTags[key];
			return obj; 
		});
		
		return uniqueTags;
		
	};
	
	
	
	// function that retrieves the selected items of an object array based on their ID field
	this.getSelectedItems = function (items, selectedIDs, idFieldName) {
		
		var selectedItems = [];
		for (var i=0, len=items.length; i<len;i++) {
			if (selectedIDs.indexOf (items[i][idFieldName]) !==-1) {
				selectedItems.push (items[i]);
			}
		}
		return selectedItems;
		
	};
	
	
	
	// function that checks the field value of all the items in an array. returns -1 if all are false, 1 if all are true, 0 if mixed
	this.getBooleanState = function (items, itemFieldName) {
		
		var booleanState;
		for (var i=0, len=items.length; i<len;i++) {

			if (booleanState === undefined) {
				booleanState = items[i][itemFieldName] === true ? 1 : -1;
			}
			else if ((items[i][itemFieldName] === true ? 1 : -1) !== booleanState) {
				booleanState = 0;
				break;
			}
		
		}
		
		return booleanState;
		
	};
	
		// function that checks the field value of all the items in an array, if the field value is an array. For each item, returns 1 if all are true, 0 if mixed
	this.getTagsBooleanState = function (items, selectedIDs, idFieldName, itemTagsName) {
		
		var selectedItemsLength = selectedIDs.length,
				selectedItems = this.getSelectedItems (items, selectedIDs, idFieldName),
				selectedTags = this.getUniqueTags (selectedItems, itemTagsName);
		
		for (var i=0, len=selectedTags.length; i<len;i++) {
			if (selectedTags[i].count === selectedItemsLength) {
				selectedTags[i].count = 1;
			}
			else {
				selectedTags[i].count = 0;
			}
		}
		
		return selectedTags;
		
	};
	
	
	
	// function that returns the update value of an array of boolean fields for an array of object.
	// Returns true if current state is -1, false if current state is 1, default value if current state is 0
	this.getNewBooleanState = function (items, selectedIDs, idFieldName, itemFieldNames, defaultValue) {
		
		defaultValue = (defaultValue === undefined) ? true : defaultValue;
		var newBooleanState = {},
				selectedItems = this.getSelectedItems (items, selectedIDs, idFieldName);

		for (var i=0, len=itemFieldNames.length; i<len;i++) {
			var booleanState = this.getBooleanState (selectedItems, itemFieldNames[i]);
			if (booleanState === 1) newBooleanState[itemFieldNames[i]] = false;
			else if (booleanState === -1) newBooleanState[itemFieldNames[i]] = true;
			else newBooleanState[itemFieldNames[i]] = defaultValue;
		}

		return newBooleanState;
		
	};
	
	// update 
	this.updateItems = function (items, selectedIDs, idFieldName, itemFieldName, newValue) {
		
		for (var i=0, len=items.length; i<len;i++) {
			if (selectedIDs.indexOf (items[i][idFieldName]) !==-1) {
				items[i][itemFieldName] = newValue;
				// we hide the deleted & archived items
				if (itemFieldName === 'archived' || itemFieldName === 'inTrash') {
					items[i].hidden = true;
				}
			}
		}
		
		return items;
		
	};
}]);