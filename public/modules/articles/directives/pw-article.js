'use strict';

module.exports = function (ngModule) {

	ngModule.directive('pwArticle', function($uibModal, $interval, Authentication, Articles, Notification) {
		return {
			restrict: 'AE',
			template: require('./pw-article.html'),
			scope: {},
			link: function(scope, element, attrs) {

				// toggleable values
				scope.isAsideCollapsed = true;
				scope.isEditMode = false;

			}
			
		};
	});
	
};

