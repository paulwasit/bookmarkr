'use strict';

angular.module('core').factory('pwArrayToggle', [function() {

	return function(array, value) {
		
		var index = array.indexOf(value);
		
		if (index===-1) {
			array.push(value);
		}
		else {
			array.splice(index, 1);
		}
		
	};
	
}]);