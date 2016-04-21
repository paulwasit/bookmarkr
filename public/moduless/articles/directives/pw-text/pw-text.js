'use strict';

module.exports = function (ngModule) {
	
	ngModule.directive('pwText', function() {
		return {
			restrict: 'E',
			template: require('./pw-text.html'),
			scope: {},
			link: function(scope, element, attrs) {
				
				/*
				var container = angular.element(document.getElementById('container'));
				var section2 = angular.element(document.getElementById('section-2'));

				scope.toTheTop = function() {
					container.scrollTop(0, 5000);
				};

				scope.toSection2 = function() {
					container.scrollTo(section2, 0, 1000);
				};
				*/
				
			}
		};
	});
	
};