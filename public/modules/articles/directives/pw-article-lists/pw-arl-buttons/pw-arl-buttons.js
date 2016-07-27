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
					content: [{body: 'start typing here'}]
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
			function deleteItems (items) {
				
				var items = items || [],
					  query = {};
				query.inTrash = true; 
				
				console.log(items);
				
				Articles.delete({ fields: JSON.stringify(query), items: JSON.stringify(items) }, 
				function() {
					console.log("ok");
					//Notification.success('article successfully updated');
				}, 
				function(errorResponse) {
					var error = errorResponse.data.message;
					Notification.error(error);
				});
				
				//$scope.activeItems = []; 
				
			}
			
			// popover template when no items are selected
			var emptyAllPopover = {
				templateUrl: 'modules/articles/directives/pw-article-lists/pw-arl-buttons/myPopoverTemplate.html',
				content: 'You\'re about to permanently delete all the items in this folder.',
				button: 'Empty',
				fn: function () {
					deleteItems();
				}
			};
			
			// popover template when some items are selected
			var emptySelectedPopover = {
				templateUrl: 'modules/articles/directives/pw-article-lists/pw-arl-buttons/myPopoverTemplate.html',
				content: 'You\'re about to permanently delete all the selected items.',
				button: 'Empty',
				fn: function () {
					deleteItems(ctrl.pwArticleList.selectedArticles);
				}
			};
			
			
			
		}]
	});
};
	