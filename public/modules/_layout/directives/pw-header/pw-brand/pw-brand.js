'use strict';

angular.module('layout').
directive('pwBrand', [function() {
	
	return {
    restrict: 'E',
    templateUrl: 'modules/_layout/directives/pw-header/pw-brand/pw-brand.html',
		scope: {}	
	};
	
}]);