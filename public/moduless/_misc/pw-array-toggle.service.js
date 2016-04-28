'use strict';

module.exports = function (ngModule) {
	
	ngModule.factory('pwArrayToggle', function() {

		return function(array, value) {
			
			var index = array.indexOf(value);
			
			if (index===-1) {
				array.push(value);
			}
			else {
				array.splice(index, 1);
			}
			
		};
		
	});
	
};