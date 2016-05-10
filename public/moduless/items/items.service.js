'use strict';

module.exports = function (ngModule) {
	
	require('../_misc/pw-array-toggle.service')(ngModule);
	
	ngModule.service('Items', function ($rootScope, pwArrayToggle) {
	
		
		// -------------------- FIELD NAMES -------------------------------------------------- //

		var tagFieldName = 'tags',
				idFieldName = '_id',
				inTrashFieldName = 'inTrash',
				archivedFieldName = 'archived',
				favoriteFieldName = 'favorite',
				isPublicFieldName = 'isPublic';

			
		// -------------------- TAGS --------------------------------------------------------- //
			
			// function that pushes tags into an array of objects {name: tagName, count: tagCount}
			this.getUniqueTags = function (items, itemTagsName) {
				
				// we loop through the items to get an object with key/values = tagName/tagCount
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

				// we transform the object into an array of objects {name: tagName, count: tagCount}: one for each tag
				uniqueTags = Object.keys(uniqueTags).map (function(key) { 
					var obj = {};
					obj.name = key;
					obj.count = uniqueTags[key];
					return obj; 
				});
				
				return uniqueTags;
				
			};
			
			
		// -------------------- EDIT MODE -------------------------------------------------- //
			
			var edit = {};
			edit.items = [];
			edit.ids = [];   // array of items Id selected for bulk edit
			edit.query = {}; // query passed to the DB to update the selected items
			edit.tags = {};  // tags
			edit.tagsQuery = [];
			edit.old = {};
			edit.old.ids = {};
			edit.old.items = [];
			
			this.reset = function () {
				edit.items = [];
				edit.ids = [];
				edit.query = {};
				edit.tags = {};
				edit.tagsQuery = [];
				edit.old = {};
				edit.old.ids = {};
				edit.old.items = [];
			};
			
			this.queryValue = function (field) {
				return edit.query[field];
			};
			
			this.isEditMode = function () {
				return edit.ids.length > 0;
			};
			
			this.isInEditScope = function (item) {
				return edit.ids.indexOf(item) !== -1;
			};
			
			// add-remove an item from the edit list + update the tags & query accordingly
			this.toggleId = function (value) {
				pwArrayToggle(edit.ids, value);
				if (this.isEditMode() === false) {
					this.reset();
					//$scope.emptyPopover = $scope.emptyAllPopover;
				}
				else {
					edit.query = this.getNewBooleanState (items, edit.ids, idFieldName, [archivedFieldName, inTrashFieldName, favoriteFieldName, isPublicFieldName]);
					edit.tags = this.getTagsBooleanState(items, edit.ids, idFieldName, tagFieldName);
					//$scope.emptyPopover = $scope.emptySelectedPopover;
				}
			};	
			
			this.toggleTag = function (value) {
				var position = getTagPosition(value);
				if (position=== false) {
					edit.tags.push({name: value, count: 1});
				}
				else if (edit.tags[position].count === 0) {
					edit.tags[position].count = 1;
				}
				else {
					edit.tags.splice(position, 1);
				}
				items = this.updateItems (items, edit.ids, idFieldName, tagFieldName, edit.tags);
				$rootScope.$broadcast('itemsUpdate', items);
			};
			
			this.isInEditTags = function (value) {
				var position = getTagPosition(value);
				if (position === false) return false;
				return edit.tags[position].count;
			};
			
			function getTagPosition (value) {
				for (var i=0, len=edit.tags.length; i<len;i++) {
					if (edit.tags[i].name === value) {
						return i;
					}
				}
				return false;
			}
			
			
		// -------------------- UPDATE ------------------------------------------------------- //
			
			// update 
			this.updateItems = function (items, selectedIDs, idFieldName, itemFieldName, newValue) {
				
				for (var i=0, len=items.length; i<len;i++) {
					if (selectedIDs.indexOf (items[i][idFieldName]) !==-1) {
						if (itemFieldName === tagFieldName) {
							
							var itemTags = items[i][tagFieldName];
							var newValNames = [];
							
							// loop on selected tags
							for (var j=0, len2=newValue.length; j<len2;j++) {
								
								newValNames.push (newValue[j].name);
								if (newValue[j].count === 0) {continue;}
								if (itemTags.indexOf (newValue[j].name) === -1) {itemTags.push(newValue[j].name);}
							}
							
							// loop on itemTags
							for (j=0, len2=itemTags.length; j<len2;j++) {
								if (newValNames.indexOf (itemTags[j]) === -1) {itemTags.splice(j, 1);}
							}				
							
						}
						else {
							items[i][itemFieldName] = newValue;
							// we hide the deleted & archived items
							if (itemFieldName === archivedFieldName || itemFieldName === inTrashFieldName) {
								items[i].hidden = true;
							}
						}
					}
				}
				
				return items;
				
			};
			
			this.clientUpdate = function (field) {
				edit.old.items = angular.copy(items);
				edit.old.ids = angular.copy(edit.ids);
				items = this.updateItems (items, edit.ids, idFieldName, field, edit.query[field]);
				edit.ids = [];
				$rootScope.$broadcast('itemsUpdate', items);
			};
			
			this.cancelUpdate = function () {
				items = edit.old.items;
				edit.ids = edit.old.ids;
				$rootScope.$broadcast('itemsUpdate', items);
			};
			
			this.serverUpdateParams = function (field) {
				var query = {},
						body = edit.old.ids;
				
				query[field] = edit.query[field];
				this.reset();
				return { query: { fields: JSON.stringify(query) }, body: { items: JSON.stringify(body) } };
			};
			
			

			
			
		// -------------------- TAGS --------------------------------------------------------- //

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


		// -------------------- FIELDS ------------------------------------------------------- //
			
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
			
			// function that returns the update value of an array of boolean fields for an array of object.
			// Returns true if current state is -1, false if current state is 1, default value if current state is 0
			this.getNewBooleanState = function (items, selectedIDs, idFieldName, itemFieldNames, defaultValue) {
				
				defaultValue = (typeof(defaultValue) === 'undefined') ? true : defaultValue;
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
			
			
		// -------------------- GET SELECTED ITEMS ------------------------------------------- //
			
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
			
			
		// -------------------- ITEMS ------------------------------------------------------ //
			
			
			var items, tags;
			this.getItems = function (newItems) {
				items = newItems;
				tags = this.getUniqueTags (items, 'tags');
			};
			
		
		
	});

};