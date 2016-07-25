'use strict';

module.exports = function (ngModule) {

	require('~/_misc/pw-in-header')(ngModule);	
	
	ngModule.component('pwArlButtons', {
		template: require('./pw-arl-buttons.html'),
		bindings: {
			article: '='
		},
		require: {
			pwArticleView: '^^'
		},
		controller: ['Items', '$location', '$rootScope',
		function (Items, $location, $rootScope) {
		
			// exposed values 
			this.$onInit = function () {
				this.listQuery = Items.getListQuery(); // remember the article list filters that were active when the user clicked the article link
			};
			
			// exposed functions
			this.togglePublic = togglePublic;  // update value & save article
			this.toggleSlide  = toggleSlide;   // update value & save article
			
			
			////////////
			
			
			// Make an Article Public / Private
			function togglePublic () {
				this.article.isPublic = !this.article.isPublic;
				this.pwArticleView.updateFn();
			}
			
			// Make an Article Slide / Full
			function toggleSlide () {
				this.article.isSlide = !this.article.isSlide;
				this.pwArticleView.updateFn();
			}
		
		}]
	});
};
	