'use strict';

module.exports = function (ngModule) {

	require('../../../../_misc/pw-array-toggle.service')(ngModule);
	require('../../../../items/directives/pw-item-menu/pw-item-menu')(ngModule);
	
	ngModule.directive('pwCardItem', function(pwArrayToggle) {
	
		return {
			restrict: 'E',
			template: require('./pw-card-item.html'),
			scope: {
				item: '='
			},
			require: '^pwArticleList',
			link: function(scope, element, attrs, pwArticleListCtrl) { 

				scope.toggle = function(field, value) {
					if (field === 'tags') return pwArrayToggle(pwArticleListCtrl.activeTags, value);
				};
				
				scope.isActive = function(field, value) {
					if (field === 'tags') return pwArticleListCtrl.activeTags.indexOf(value) !== -1;
				};
				
			}
		};
		
	});
	
};