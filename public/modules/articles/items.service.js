'use strict';

module.exports = function (ngModule) {
	
	ngModule.service('Items', function () {
		
		var fieldNames = {
			id: '_id',
			collectionTag: 'collectionTag',
			tags: 'tags',
			update: {
				inTrash: 'inTrash',
				archived: 'archived',
				favorite: 'favorite',
				isPublic: 'isPublic'
			}
		};
			
		// exposed functions
		this.updateQueryValues = updateQueryValues; // update all the query values to pass to the db for update, based on the selected items
		this.toggleTag = toggleTag;									// 
		this.getUniqueTags = getUniqueTags;					// get the list of unique tags of an articles list
		
		this.updateAngularItems = updateAngularItems;
		this.serverUpdateParams = serverUpdateParams;
		
		////////////
		
		// update all the query values to pass to the db for update, based on the selected items
		function updateQueryValues (items, selectedIds) {
			var selectedItems = [];
			for (var i=0, len=items.length; i<len;i++) {
				if ( selectedIds.indexOf(items[i][fieldNames.id] ) !== -1) selectedItems.push(items[i]);
			}
			
			// init
			var edit = {
				query: {}, // query passed to the DB
				tags: {}
			};
			// update values if selected items
			if (items.length > 0) {
				var selectedTags = getUniqueTags (selectedItems)
				edit.query = setNewBooleanStates  (selectedItems, fieldNames.update);
				edit.tags  = setTagsBooleanStates (selectedItems, selectedTags);
			}
			return edit;
		}
		
		function toggleTag (editTags, tagName) {
			// check if the tag is in the selected items
			var position = false;
			for (var i=0, len=editTags.length; i<len;i++) {
				if (editTags[i].name === tagName) {
					position = i;
					break;
				}
			}
			// if not, newCount = 1
			if (position === false) {
				editTags.push({name: tagName, count: false, newCount: 1});
			}
			// if yes, but not all the items have it, add it to all items
			else if (editTags[position].newCount === 0) {
				editTags[position].newCount = 1;
			}
			// if all the items have it, remove it from all items
			else {
				editTags[position].newCount = false;
			}
			return editTags;
		};
		
		// get the list of unique tags of an articles list
		function getUniqueTags (items) {
			// init
			var tags = [], 
					uniqueTags;
			// complete list of tags, incl. several occurrences
			for ( var i=0, len=items.length; i<len; i++ ) {
				tags = tags.concat( items[i][fieldNames.tags] );
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
		}
		
		
		//////////// update related functions
		
		// update front end articles (faster than waiting for a server call; also allows rollback to previous values on cancel)
		function updateAngularItems (items, selectedIds, itemFieldName, newValue) {
			
			for (var i=0, len=items.length; i<len;i++) {
				
				if ( selectedIds.indexOf(items[i][fieldNames.id] ) === -1) continue;

				if ( itemFieldName === fieldNames.tags ) {
					// get the status of each tag in the selected articles array
					var itemTags = items[i][fieldNames.tags];
					// loop on selected tags
					for (var j=0, len2=newValue.length; j<len2;j++) {
						// no change for the tag
						if (newValue[j].count === newValue[j].newCount) continue;
						// tag now applied to all selected items
						if (newValue[j].newCount === 1) { 
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
			
			return items;
			
		}
		
		function serverUpdateParams (selectedIds, edit, field, newCollectionValue) {
			var query = {},
				setQuery = {},
				addToSetQuery = {},
				pullQuery = {};
			
			// we add/pull tags or change the boolean status of the field
			if (field === fieldNames.tags) {
				var addedTags = getAddedTags(edit.tags),
					removedTags = getRemovedTags(edit.tags);
				if (addedTags.length > 0) {
					addToSetQuery[field] = {$each: addedTags};
					query.addToSet = JSON.stringify(addToSetQuery);
				}
				if (removedTags.length > 0) {
					pullQuery[field] = {$in: removedTags};
					query.pull = JSON.stringify(pullQuery);
				}
			}
			else if (field === fieldNames.collectionTag) {
				setQuery[field] = newCollectionValue;
				query.set = JSON.stringify(setQuery);
			}
			else {
				setQuery[field] = !edit.query[field]; // we updated the query values with the new value, so we have to revert back for server update
				query.set = JSON.stringify(setQuery);
			}
		
			return { query: query, body: { items: JSON.stringify(selectedIds) } };
		}
		
		
		//////////// internal helper functions
		
		// function that checks the tags of an array of items. For each tag, returns 1 if all items have it, 0 if mixed
		function setTagsBooleanStates (items, uniqueTags) {
			var itemsLength = items.length;
			for (var i=0, len=uniqueTags.length; i<len;i++) {
				uniqueTags[i].count = (uniqueTags[i].count === itemsLength) ? 1 : 0;
				uniqueTags[i].newCount = angular.copy(uniqueTags[i].count);
			}
			return uniqueTags;
		}
		
		// Update the display texts & icons of the navbar when in edit mode
		// Returns false if all selected items are true, true if false, and default if mixed
		function setNewBooleanStates( items, itemFieldNames, defaultValue ) {
			defaultValue = (typeof defaultValue === 'undefined') ? true : defaultValue;
			var newBooleanStates = {};
			// update the boolean value for each field
			Object.keys(itemFieldNames).forEach(function(key) {
				newBooleanStates[itemFieldNames[key]] = setNewBooleanState( items, itemFieldNames[key], defaultValue );		
			});
			return newBooleanStates;
		}

		function setNewBooleanState( items, itemFieldName, defaultValue ) {
			var booleanState,
					booleanValue;
			// check if each item has the same boolean value or not
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
		}
		
		// check tags removed & added to the selected items
		function getAddedTags (editTags) {
			var addedTags = [];
			for (var i=0, len=editTags.length; i<len;i++) {
				if (editTags[i].count !== editTags[i].newCount && editTags[i].newCount === 1) {
					addedTags.push(editTags[i].name)
				}
			}
			return addedTags;
		}
		
		function getRemovedTags (editTags) {
			var removedTags = [];
			for (var i=0, len=editTags.length; i<len;i++) {
				if (editTags[i].count !== editTags[i].newCount && editTags[i].newCount === false) {
					removedTags.push(editTags[i].name)
				}
			}
			return removedTags;
		}
		
	});
};