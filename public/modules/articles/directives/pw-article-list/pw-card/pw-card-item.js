'use strict';

var pwArrayToggle = require('../../../../_misc/pw-array-toggle');

module.exports = function (ngModule) {

	require('../../../../items/directives/pw-item-menu/pw-item-menu')(ngModule);
	
	ngModule.directive('pwCardItem', function() {
	
		return {
			restrict: 'AE',
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