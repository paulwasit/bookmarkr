'use strict';

module.exports = function (ngModule) {
	
	ngModule.directive('pwFocusMe', function ($timeout) {
		return {
			link: function (scope, element, attr) {
				attr.$observe('pwFocusMe', function (value) {
					scope.$watch(value, function (oldValue) {
						$timeout(function () {
							element.next()[0].CodeMirror.refresh();
						});
					});
				});
			}
		};
	});
};

//pw-focus-me="true"