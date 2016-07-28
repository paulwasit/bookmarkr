'use strict';

module.exports = function (ngModule) {

	require('~/_misc/pw-in-header')(ngModule);	
	
	ngModule.component('pwArlButtons', {
		template: require('./pw-arl-buttons.html'),
		bindings: {
			selectedArticles: '<'
		},
		require: {
			pwArticleList: '^^'
		},
		controller: ['$state', '$location', 'Articles', 'Notification',
		function ($state, $location, Articles, Notification) {
		
			var ctrl = this;
			
			// exposed functions
			this.createItem = createItem;
			this.deleteItems = deleteItems;
			
			// exposed values 
			this.$onInit = function () {
				this.emptyPopover = emptyAllPopover;
				this.$state = $state;
			};
			
			// changes
			this.$onChanges = function (changes) {
				if (changes.selectedArticles) {
					this.emptyPopover = (this.selectedArticles.length > 0) ? emptySelectedPopover : emptyAllPopover;
				}
			}
			
			////////////
			
			
			function createItem () {
				var article = new Articles({
					title: "Untitled",
					content: [{body: 'start typing here'}],
					collectionTag: ctrl.$state.params.collection
				});
				article.$save(
					function(response) {
						$location.path('articles/' + response._id);
					},
					function(errorResponse) {
						var error = errorResponse.data.message;
						Notification.error(error);
					}
				);
			}
			
			// delete selected DB item then reload it
			function deleteItems (selectedItems, type) {
			
				var query = { 'inTrash': true };
				if (type === "id") {
					var selectedIds = selectedItems;
				}
				else {
					var selectedIds = [];
					for (var i=0,l=selectedItems.length;i<l;i++) {
						selectedIds.push(selectedItems[i]._id);
					}
				}
				
				// db call
				Articles.remove({ fields: JSON.stringify(query), items: JSON.stringify(selectedIds) }, 
				function(successResponse) {
					//Notification.success(successResponse.n + ' articles successfully deleted');
					$state.reload();
				}, 
				function(errorResponse) {
					var error = errorResponse.data.message;
					Notification.error(error);
				});
				
			}
			
			// popover template when no items are selected
			var emptyAllPopover = {
				templateUrl: 'modules/articles/components/pw-article-list/pw-arl-buttons/myPopoverTemplate.html',
				content: 'You\'re about to permanently delete all the items in this folder.',
				button: 'Empty',
				fn: function () {
					deleteItems(ctrl.pwArticleList.filteredArticles, "items");
				}
			};
			
			// popover template when some items are selected
			var emptySelectedPopover = {
				templateUrl: 'modules/articles/components/pw-article-list/pw-arl-buttons/myPopoverTemplate.html',
				content: 'You\'re about to permanently delete all the selected items.',
				button: 'Empty',
				fn: function () {
					deleteItems(ctrl.pwArticleList.selectedArticles, "id");
				}
			};
			
			
			
		}]
	});
};
	