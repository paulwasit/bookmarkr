'use strict';

module.exports = function (ngModule) {
	
	require('~/_misc/filters')(ngModule);
	require('./pw-item-menu/pw-item-menu')(ngModule);
	
	ngModule.component('pwArlContent', {
		template: require('./pw-arl-content.html'),
		bindings: {
			items: "<",
			isEditMode: "<"
		},
		require: {
			pwArticleList: '^^'
		},
		controller: ['$state', '$timeout', 'Articles', 'Items', 'Notification', 
		function ($state, $timeout, Articles, Items, Notification) {
			
			// handles 'this' in fn calls
			var ctrl = this,
					previousItemsValue;
			
			// initialize exposed variables
			this.$onInit = function () {
				this.sortableConfig = sortableConfig;
			};
			
			// exposed functions
			this.updatePos = updatePos; // save new articles positions after sortable, if changed
			
			// changes
			this.$onChanges = function (changes) {
				if (changes.isEditMode && this.sortableConfig) this.sortableConfig.disabled = !changes.isEditMode.currentValue;
			}
			
			
			////////////
			
			var sortableConfig = {
				ghostClass: "article-list-ghost",
				disabled: true,
				animation: 150,
				onSort: function (evt){
					evt.index = evt.newIndex;  // element's new index within parent
					ctrl.updatePos();
				}
			};
		
			function updatePos () {
				for (var i=0, l=this.items.length; i<l;i++) {
					if (this.items[i].index !== i) {
						this.items[i].index = i;
						this.items[i].$update(
						function() {
							// Notification.success('article successfully updated');
						}, 
						function(errorResponse) {
							var error = errorResponse.data.message;
							Notification.error(error);
						});
					}
				}
			}
		
		}]
	});
};

