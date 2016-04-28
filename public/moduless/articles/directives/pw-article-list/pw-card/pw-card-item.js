'use strict';

module.exports = function (ngModule) {

	require('../../../../_misc/pw-array-toggle.service')(ngModule);
	
	ngModule.directive('pwCardItem', function(pwArrayToggle) {
	
		return {
			restrict: 'E',
			template: require('./pw-card-item.html'),
			scope: {
				item: '='
			},
			//require: ['^pwArticleList', '^pwCardList'],
			require: '^pwArticleList',
			link: function(scope, element, attrs, pwArticleListCtrl) { 

				/*
				var pwArticleList = ctrls[0],
						pwCardListCtrl = ctrls[1];
				*/
				
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