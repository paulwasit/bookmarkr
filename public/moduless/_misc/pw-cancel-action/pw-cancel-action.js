'use strict';

function pwCancelAction($compile, $window, $parse, $timeout) {
	
	var template, 
			bodyElement = angular.element(document).find('body');
	
	template = '<div class="alert alert-warning cancel-alert col-xs-offset-1 col-xs-10 col-md-offset-5 col-md-2 text-center" ng-click="cancelAction()">' +
						   '<a>About to cancel</a>' +
						 '</div>';

  return {
		scope: true,
		link: function(scope, elem, attr) {

			var doneFn = $parse(attr.pwCancelAction),
					inProgFn = $parse(attr.pwInprog) || undefined,
					cancelFn = $parse(attr.pwCancel) || undefined,
					delay = parseInt(attr.pwDelay) || 5000;
			
			// on click: append cancel notification template to the body & start countdown until fn
			elem.on('click', function() {

				if (!scope.action) {
					
					// execute the 'in progress' action if defined
					if (inProgFn !== undefined) {
						inProgFn(scope);
					}
					
					// append the notification to body
					scope.cancelAlert = $compile(template)(scope);
					bodyElement.append(scope.cancelAlert);
				
					// starts the timeout period before the 'done' function is executed
					scope.action = $timeout(function(){
						scope.cancelAlert.remove();
						delete scope.action;
						return doneFn(scope);
					}, delay);
					
				}
				else {
					console.log('already fired');
				}
				
			});
			
			// cancelling timeout on click + execute the 'cancel' action if defined
			scope.cancelAction = function () {
				$timeout.cancel(scope.action);
				scope.cancelAlert.remove();
				delete scope.action;
				if (cancelFn !== undefined) {
					cancelFn(scope);
				}
			};
			
			// we apply the 'done' function if the user clicks outside the template during the timeout
			angular.element($window).on('click', function (event) {
				if (elem[0].contains(event.target)) return;
				if ($timeout.cancel(scope.action)) {
					scope.cancelAlert.remove();
					delete scope.action;
					return doneFn(scope);
				}
			});
			
			// we apply the 'done' function on destroy
			scope.$on('$destroy', function() {
				if ($timeout.cancel(scope.action)) {
					scope.cancelAlert.remove();
					delete scope.action;
					return doneFn(scope);
				}
			});
			
		}

	};
	
}

module.exports = function (ngModule) {
	
	ngModule.directive('pwCancelAction', pwCancelAction);

};
