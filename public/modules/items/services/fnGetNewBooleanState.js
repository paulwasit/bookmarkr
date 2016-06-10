'use strict';

// function that returns the update value of an array of boolean fields for an array of object.
// Returns true if current state is -1, false if current state is 1, default value if current state is 0

module.exports = function getNewBooleanState (selectedItems, itemFieldNames, defaultValue) {
	
	defaultValue = (typeof(defaultValue) === 'undefined') ? true : defaultValue;
	var newBooleanState = {};

	for (var i=0, len=itemFieldNames.length; i<len;i++) {
		var booleanState = getBooleanState (selectedItems, itemFieldNames[i]);
		if (booleanState === 1) {
			newBooleanState[itemFieldNames[i]] = false;
		}
		else if (booleanState === -1) {
			newBooleanState[itemFieldNames[i]] = true;
		}
		else {
			newBooleanState[itemFieldNames[i]] = defaultValue;
		}
	
	};
	
	return newBooleanState;
};


// function that checks the field value of all the items in an array. returns -1 if all are false, 1 if all are true, 0 if mixed
function getBooleanState (items, itemFieldName) {

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