
'use strict';

module.exports = function (ngModule) {
	
	require('./pw-tags/pw-tag-list')(ngModule);
	require('./pw-tags/pw-tag-item')(ngModule);
	require('../../../../_misc/pw-click-outside')(ngModule);    // hide the toc when clicking outside on small screens
	
	ngModule.directive('pwArticleListAside', function($state) {
		
		return {
			restrict: 'AE',
			template: require('./pw-article-list-aside.html'),
			scope: {
				tags: '=',
				isAsideCollapsed: "="
			},
			link: function(scope, element, attrs) {
				scope.$state = $state;
				// action on click-outside
				scope.closeThis = function () { scope.isAsideCollapsed = true; };
			}
		};
	});
	
};