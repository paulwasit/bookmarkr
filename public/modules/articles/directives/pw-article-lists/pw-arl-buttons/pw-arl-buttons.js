'use strict';

module.exports = function (ngModule) {

	require('~/_misc/pw-in-header')(ngModule);	
	
	ngModule.component('pwArlButtons', {
		template: require('./pw-arl-buttons.html'),
		bindings: {},
		require: {
			pwArticleList: '^^'
		},
		controller: ['$location', 'Articles', 'Notification',
		function ($location, Articles, Notification) {
		
			// exposed values 
			this.$onInit = function () {};
			
			// exposed functions
			this.createItem = createItem;
			
			
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
			
			
		}]
	});
};
	