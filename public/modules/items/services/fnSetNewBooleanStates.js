'use strict';

// Update the display texts & icons of the navbar when in edit mode
// Returns false if all selected items are true, true if false, and default if mixed

module.exports = function setNewBooleanStates( selectedItems, itemFieldNames, defaultValue ) {
	
	defaultValue = (typeof defaultValue === 'undefined') ? true : defaultValue;
	var newBooleanStates = {};

	Object.keys(itemFieldNames).forEach(function(key) {
		newBooleanStates[itemFieldNames[key]] = setNewBooleanState( selectedItems, itemFieldNames[key], defaultValue );		
	});
	
	return newBooleanStates;
	
};

function setNewBooleanState( items, itemFieldName, defaultValue ) {
	
	var booleanState,
			booleanValue;
	 
	for ( var i=0, len=items.length; i<len; i++ ) {
		booleanValue = !items[i][itemFieldName];
		if ( i === 0) {
			booleanState = booleanValue;
		}
		else if ( booleanValue !== booleanState ) {
			return defaultValue;
		}
	}

	return booleanState;
	
};