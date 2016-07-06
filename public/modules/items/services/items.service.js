'use strict';

module.exports = function (ngModule) {
	
	ngModule.service('Items', function ($rootScope) {
		
		// variables
		var 
			listQuery,
			items, 
			tags,
			fieldNames = {
				id: '_id',
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
				ids: [],				// array of items Id selected for bulk edit
				query: {},			// query passed to the DB to update the selected items
				tags: {},
				old: {
					ids: {},
					items: []
				}
			},
			edit = angular.copy(editBlank);

		var setUniqueTags = require('./fnSetUniqueTags'),		
				toggleItem = require('./fnToggleItem');
		
		
	// -------------------- INIT ------------------------------------------------------- //	
	// save data that has been collected from the server db
		
		this.setListQuery = function (query) {
			listQuery = query;
		};
		
		this.getListQuery = function () {
			return listQuery;
		};
		
		this.setItems = function (newItems) {
			items = newItems;
			tags = setUniqueTags (items, fieldNames.tags);
		};
		
		this.getItems = function() {
			return items;
		};
		
		this.getUniqueTags = function() {
			return tags;
		};
		
		
		
	// -------------------- HELPERS ---------------------------------------------------- //
		
		this.reset = function () {
			edit = angular.copy(editBlank);
		};
		
		this.isEditMode = function () {
			return edit.ids.length > 0;
		};
		
		this.isInEditScope = function (item) {
			return edit.ids.indexOf(item) !== -1;
		};
		
		this.queryValue = function (field) {
			return edit.query[field];
		};
		
		// indicates whether the tagName is used by all/some selected items
		this.isInEditTags = function (tagName) {
			var position = getTagPosition(tagName);
			if (position === false) return false;
			return edit.tags[position].count;
		};
		
		
		
	// -------------------- ADD/REMOVE ITEM TO SELECTION ------------------------------- //
	// add-remove an item from the edit list + update the tags & query (reset if edit list is empty)
		
		this.toggleId = function (value) {
			edit = toggleItem(edit, items, value, fieldNames);
			if (edit === false) this.reset();
		};	
		

	// -------------------- ADD/REMOVE TAG TO SELECTION -------------------------------- //
	
		this.toggleTag = function (tagName) {
			var position = getTagPosition(tagName);
			if (position=== false) {
				edit.tags.push({name: tagName, count: false, newCount: 1});
			}
			else if (edit.tags[position].newCount === 0) {
				edit.tags[position].newCount = 1;
			}
			else {
				edit.tags[position].newCount = false;
			}
		};
		
		function getTagPosition (tagName) {
			for (var i=0, len=edit.tags.length; i<len;i++) {
				if (edit.tags[i].name === tagName) {
					return i;
				}
			}
			return false;
		}
		
		function getAddedTags () {
			var addedTags = [];
			for (var i=0, len=edit.tags.length; i<len;i++) {
				if (edit.tags[i].count !== edit.tags[i].newCount && edit.tags[i].newCount === 1) {
					addedTags.push(edit.tags[i].name)
				}
			}
			return addedTags;
		}
		
		function getRemovedTags () {
			var removedTags = [];
			for (var i=0, len=edit.tags.length; i<len;i++) {
				if (edit.tags[i].count !== edit.tags[i].newCount && edit.tags[i].newCount === false) {
					removedTags.push(edit.tags[i].name)
				}
			}
			return removedTags;
		}
		
		
	// -------------------- UPDATE ------------------------------------------------------- //
		
		this.updateFrontEndItems = require('./fnUpdateFrontEndItems');
		
		this.clientUpdate = function (field, newCollectionValue) {
			edit.old.items = angular.copy(items);
			edit.old.ids = angular.copy(edit.ids);
			var newValue = (field === fieldNames.tags) ? edit.tags : 
										 (field === fieldNames.collectionTag) ? newCollectionValue : edit.query[field];
			items = this.updateFrontEndItems (items, edit.ids, fieldNames, field, newValue);
			tags = setUniqueTags (items, fieldNames.tags);
			edit.ids = [];
			$rootScope.$broadcast('itemsUpdate', items);
		};
		
		this.cancelUpdate = function () {
			items = edit.old.items;
			// we only keep the selection if there are more than one selected items
			if (edit.old.ids.length > 1) {
				edit.ids = edit.old.ids;
			}
			else {
				this.reset();
			}
			$rootScope.$broadcast('itemsUpdate', items);
		};
		
		this.serverUpdateParams = function (field, newCollectionValue) {
			var 
				body = edit.old.ids,
				query = {},
				setQuery = {},
				addToSetQuery = {},
				pullQuery = {};
			
			// we add/pull tags or change the boolean status of the field
			if (field === fieldNames.tags) {
				var 
					addedTags = getAddedTags(),
					removedTags = getRemovedTags();
				if (addedTags.length > 0) {
					addToSetQuery[field] = addedTags;
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
				setQuery[field] = edit.query[field];
				query.set = JSON.stringify(setQuery);
			}
			
			this.reset();
			return { query: query, body: { items: JSON.stringify(body) } };
		};

	});
	
};