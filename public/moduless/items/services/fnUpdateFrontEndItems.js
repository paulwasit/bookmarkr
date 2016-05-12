'use strict';

module.exports = function updateFrontEndItems (items, selectedIDs, fieldNames, itemFieldName, newValue) {
	
	for (var i=0, len=items.length; i<len;i++) {
		if (selectedIDs.indexOf (items[i][fieldNames.id]) !==-1) {
			
			if (itemFieldName === fieldNames.tags) {
			
				var itemTags = items[i][fieldNames.tags];
				
				// loop on selected tags
				for (var j=0, len2=newValue.length; j<len2;j++) {
					// no change for the tag
					if (newValue[j].count === newValue[j].newCount) { 
						continue;
					} 
					// tag now applied to all selected items
					else if (newValue[j].newCount === 1) { 
						if (itemTags.indexOf (newValue[j].name) === -1) {itemTags.push(newValue[j].name);}
					}
					// tag now applied to no selected items
					else if (newValue[j].newCount === false) {
						if (itemTags.indexOf (newValue[j].name) !== -1) {itemTags.splice(itemTags.indexOf (newValue[j].name), 1);}
					}
				}
	
			}
			else {
				items[i][itemFieldName] = newValue;
				// we hide the deleted & archived items
				if (itemFieldName === fieldNames.update.archived || itemFieldName === fieldNames.update.inTrash) {
					items[i].hidden = true;
				}
			}
			
		}
	}
	
	return items;
	
};


