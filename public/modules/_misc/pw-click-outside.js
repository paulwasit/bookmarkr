'use strict';

module.exports = function (ngModule) {
	
	ngModule.directive('pwClickOutside', function ($document, $parse, $timeout) {

		return function (scope, element, attrs) {
			
			var fn = $parse(attrs.pwClickOutside);
			
			var onClick = function (event) {
				var isChild = element[0].contains(event.target),
						isSelf = element[0] === event.target,
						isInside = isChild || isSelf;

				if (!isInside) {
					scope.$apply(function () {
						return fn(scope);
					});
				}
				
			};
			
			scope.$watch(attrs.isActive, function(newValue, oldValue) {
				
				if (newValue !== oldValue && newValue === true) {
					$timeout(function() {
						$document.bind('click', onClick);
					});
				}
				else if (newValue !== oldValue && newValue === false) {
					$timeout(function() {
						$document.unbind('click', onClick);
					});
				}
				
			});
			
			scope.$on('$destroy', function() {
				$timeout(function() {
					$document.unbind('click', onClick);
				});
			});
			
		};
	
	});

};
//isChild = element[0].contains(event.target);