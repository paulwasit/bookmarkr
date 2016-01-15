'use strict';

function pwCancelAction($compile, $parse, $timeout) {
	
	var action = false,
			template, cancelAlert,
			bodyElement = angular.element(document).find('body');
	
	template = '<div pw-cancel-alert cancel-msg="Ready to cancel ?" action="action" hide-during-action-cancel="hideDuringActionCancel"></div>';
		
  return function(scope, elem, attr) {

		var	fn = $parse(attr.pwCancelAction),
				delay = parseInt(attr.pwDelay) || 5000;
			
		// on click: append cancel notification template to the body & start countdown until fn
		elem.on('click', function() {
			
			cancelAlert = $compile(template)(scope);
			bodyElement.append(cancelAlert);
			
			//if (toHide) scope.hideDuringActionCancel = true;
			scope.hideDuringActionCancel = (attr.pwToHide !== undefined) ? attr.pwToHide : null;
			
			scope.action = $timeout(function(){
				cancelAlert.remove();
				return fn(scope);
			}, delay);
			
		});
		
		scope.$on('$destroy', function() {
			if ($timeout.cancel(scope.action)) {
				cancelAlert.remove();
				return fn(scope);
			}
		});
		
	};

}

angular.module('core')
.directive('pwCancelAction', ['$compile', '$parse', '$timeout', pwCancelAction])

.directive('pwCancelAlert', ['$timeout', function ($timeout) {
	
	return {
		templateUrl: 'modules/_core/directives/pw-cancel-action/pw-cancel-action.html',
		scope: {
			cancelMsg: '@',
			action: '=',
			hideDuringActionCancel: '='
		},
		link: function(scope, elem, attr) {

			scope.cancelAction = function (action) {
				scope.hideDuringActionCancel = null;
				$timeout.cancel(scope.action);
				elem.remove();
			};
			
		}
		
	};
}]);

