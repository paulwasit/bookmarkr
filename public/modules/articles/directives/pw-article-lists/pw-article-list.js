'use strict';

module.exports = function (ngModule) {

	require('./pw-arl-buttons/pw-arl-buttons')(ngModule); 		
	require('./pw-arl-content/pw-arl-content')(ngModule); 	
	require('./pw-arl-aside/pw-arl-aside')(ngModule); 
	
	var modalTemplate = require('~/_misc/pw-modal-template');
	require('~/_misc/pw-gif')(ngModule);
	
	ngModule.component('pwArticleList', {
		template: require('./pw-article-list.html'),
		bindings: {
			articles: '='
		},
		controller: ['$location', 'Authentication', 'Articles', 'Items',
		function ($location, Authentication, Articles, Items) {
			
			// initialize exposed variables
			this.$onInit = function () {
				
				// only the article author can modify it
				this.user = Authentication.user;
				
				// save articles & tags
				Items.setItems( this.articles );
				this.tags = Items.getUniqueTags();
				
				// arrays used to filter articles ( populated in the content & aside sections )
				this.activeTags = [];
				
				// toggleable values
				this.isAsideCollapsed = true;
				this.isEditMode = false;
				
			};
			
			// exposed functions - used by children components
			this.toggleAsideCollapsed = toggleAsideCollapsed;
			this.toggleEditMode = toggleEditMode;

			//
			/*
			$scope.$on('itemsUpdate', function(event, items) {
				$scope.$evalAsync(function() {
					$scope.articles = Items.getItems ();
					$scope.tags = Items.getUniqueTags ();
				});
			});
			*/
			
			// reset Items service when leaving the page
			this.$onDestroy = function () {
				return Items.reset();
			};
			
			
			////////////

			
			// trigger slide fullscreen
			function toggleAsideCollapsed (forceTrue) { 
				this.isAsideCollapsed = (typeof(forceTrue) !== 'undefined') ? forceTrue : !this.isAsideCollapsed; 
			}
			
			// toggle edit mode
			function toggleEditMode () { 
				this.isEditMode = !this.isEditMode;
			}
			
		}]
	});
};

