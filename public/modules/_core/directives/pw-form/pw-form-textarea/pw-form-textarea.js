'use strict';

angular.module('core')
.directive('pwFormTextarea', function() {
  return {
		replace: true,
    restrict: 'E',
    templateUrl: 'modules/_core/directives/pw-form/pw-form-textarea/pw-form-textarea.html',
		scope: { 
			required: '@',
			model: '=',
			id: '@',
			placeholder: '@',
			cols: '@',
			rows: '@'
		}
  };
});