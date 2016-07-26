'use strict';

module.exports = function (ngModule) {
	
	require('./pw-tags/pw-tags')(ngModule); 
	require('~/_misc/pw-click-outside')(ngModule);    // hide the toc when clicking outside on small screens
	
	ngModule.component('pwArlAside', {
		template: require('./pw-arl-aside.html'),
		bindings: {
			tags: "=",
			selectedArticles: "<"
		},
		require: {
			pwArticleList: '^^'
		},
		controller: ['$state', 'Items', function ($state, Items) {
					
			// exposed functions
			this.closeThis = closeThis; 			 // collapse aside when clicking outside it
			
			this.currentFieldValue = currentFieldValue; // return the current field value of selected items (true if all)
			
			this.clientUpdate = clientUpdate;
			this.serverUpdate = serverUpdate;
			this.cancelUpdate = cancelUpdate;
			
			
			// exposed values 
			this.$onInit = function () {
				this.$state = $state;
				this.editValues = {};
			};
			
			// changes
			this.$onChanges = function (changes) {
				if (changes.selectedArticles) {			
					this.editValues = Items.updateQueryValues(changes.selectedArticles.currentValue);
				}
			}
			
			
			////////////
			
			
			// action on click-outside
			function closeThis () { this.pwArticleList.toggleAsideCollapsed(true); }
			
			function currentFieldValue (field) {
				if (typeof this.editValues.query ==='undefined' || typeof this.editValues.query[field] === 'undefined') return false;
				return !this.editValues.query[field];
			}
			
			function clientUpdate (field, newValue) {
				// evalAsync: wait until the end of the current digest cycle to fire, so the previous cancel action has time to be complete
				scope.$evalAsync(function() {
					return Items.clientUpdate(field, newValue);
				});
			};
			
			function serverUpdate (field, newValue) {
				var params = Items.serverUpdateParams(field, newValue);
				Articles.update(params.query, params.body);
			};
			
			function cancelUpdate () {
				return Items.cancelUpdate();
			};
			
		}]
	});
};
