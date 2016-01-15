'use strict';

angular.module('core').directive('pwFormInput', function() {
  return {
    restrict: 'E',
		transclude: true,
    templateUrl: 'modules/_core/directives/pw-form/pw-form-input/pw-form-input.html',
		scope: { 
			userform: '=',
			model: '=',
			id: '@',
			placeholder: '@'
		}
  };
});