'use strict';

module.exports = function (ngModule) {
	
	require('./pw-tags/pw-tags')(ngModule); 
	require('~/_misc/pw-click-outside')(ngModule);    // hide the toc when clicking outside on small screens
	require('~/_misc/pw-ui-sref-if')(ngModule); 	    // disable click when no selected articles
	
	ngModule.component('pwArlAside', {
		template: require('./pw-arl-aside.html'),
		bindings: {
			tags: "=",
			editValues: "<"
		},
		require: {
			pwArticleList: '^^'
		},
		controller: ['$state', 'Items', function ($state, Items) {
			
			// local variables
			var oldSelectedArticles;
			
			// exposed functions
			this.closeThis = closeThis; 							  // collapse aside when clicking outside it
			this.currentFieldValue = currentFieldValue; // return the current field value of selected items (true if all)
			
			
			// exposed values 
			this.$onInit = function () {
				this.$state = $state;
				this.collections = ["javascript","r","algorithms","datascience", "projects", "misc"];
			};
			
			// changes
			this.$onChanges = function (changes) {
				// decoupling of parent/child values by doing a deep copy
				//if (changes.editValues) this.editValues = angular.copy(this.editValues); 
			}
			
			
			////////////
			
			// action on click-outside
			function closeThis () { this.pwArticleList.toggleAsideCollapsed(true); }
			
			function currentFieldValue (field) {
				if (typeof this.editValues.query ==='undefined' || typeof this.editValues.query[field] === 'undefined') return false;
				return !this.editValues.query[field];
			}
			
		}]
	});
};
