'use strict';

module.exports = function (ngModule) {
	
	ngModule.service('Items', function () {
		
		var 
			listQuery,
			fieldNames = {
				//id: '_id',
				collectionTag: 'collectionTag',
				tags: 'tags',
				update: {
					inTrash: 'inTrash',
					archived: 'archived',
					favorite: 'favorite',
					isPublic: 'isPublic'
				}
			},
			/* editBlank is used to reset to the previous values */
			editBlank = {
				query: {},			// query passed to the DB to update the selected items
				tags: {},
				old: {
					ids: {},
					items: []
				}
			},
			edit = angular.copy(editBlank);
			
		
		// exposed functions
		this.setListQuery = setListQuery;  				  // save the route query (see promise in routes.js); used for the "back" button in pw-article-viewedit
		this.getListQuery = getListQuery;						// retrive the route query
		this.updateQueryValues = updateQueryValues; // update all the query values to pass to the db for update, based on the selected items
		this.getUniqueTags = getUniqueTags;					// get the list of unique tags of an articles list
		
		
		////////////
		
		// save the route query (see promise in routes.js); used for the "back" button in pw-article-viewedit
		function setListQuery (query) {
			listQuery = query;
		}
		
		// retrive the route query
		function getListQuery () {
			return listQuery;
		}
		
		// update all the query values to pass to the db for update, based on the selected items
		function updateQueryValues (items) {

			if (items.length === 0) {
				edit = angular.copy(editBlank);
			}
			else {
				var selectedTags = getUniqueTags (items)
				edit.query = setNewBooleanStates  (items, fieldNames.update);
				edit.tags  = setTagsBooleanStates (items, selectedTags);
			}
			return edit;
		}
		
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
		
	});
};