'use strict';

function pwCancelAction($compile, $document, $parse, $timeout, $rootScope) {
	
	var template = require("./pw-cancel-action.html");
			bodyElement = angular.element(document).find('body');
	
	/*'<div class="alert alert-warning cancel-alert col-xs-offset-1 col-xs-10 col-md-offset-5 col-md-2 text-center" ng-click="cancelAction()">' +
						   '<a>About to cancel</a>' +
						 '</div>';
*/

  return {
		scope: true,
		link: function(scope, elem, attr) {

			var doneFn = $parse(attr.pwCancelAction),
					inProgFn = $parse(attr.pwInprog) || undefined,
					cancelFn = $parse(attr.pwCancel) || undefined,
					delay = parseInt(attr.pwDelay) || 5000;
			
			// on click: append cancel notification template to the body & start countdown until fn
			elem.on('click', function() {
				
				scope.onClickHandler = onClickHandler;
				
				if (!scope.action) {
				
					// execute the 'in progress' action if defined
					if (typeof (inProgFn) !== 'undefined') {
						inProgFn(scope);
					}
					
					// append the notification to body
					scope.cancelAlert = $compile(template)(scope);
					bodyElement.append(scope.cancelAlert);
				
					// starts the timeout period before the 'done' function is executed
					scope.action = $timeout(function(){
						scope.cancelAlert.remove();
						$document.off('click', scope.onClickHandler);
						delete scope.action;
						return doneFn(scope);
					}, delay);
					
					// we apply the 'done' function if the user clicks outside the template during the timeout
					$document.on('click', scope.onClickHandler);
					
				}
				else {
					//console.log('already fired');
				}
				
			});
			
			// cancelling timeout on click + execute the 'cancel' action if defined
			scope.cancelAction = function () {
				scope.cancelAlert.remove();
				$timeout.cancel(scope.action);
				$document.off('click', onClickHandler);
				delete scope.action;
				if (typeof (cancelFn) !== 'undefined') {
					cancelFn(scope);
				}
			};

			// we apply the 'done' function on state change (should not happen as clicks trigger the done Fn)
			$rootScope.$on('$stateChangeStart', 
			function(event, toState, toParams, fromState, fromParams, options){ 
				if ($timeout.cancel(scope.action)) {
					scope.cancelAlert.remove();
					$document.off('click', onClickHandler);
					delete scope.action;
					return doneFn(scope);
				}
			});
			
			// define onclick handler (both for enabling & disabling it)
			function onClickHandler (event) {
				if (elem[0].contains(event.target)) return;
				if ($timeout.cancel(scope.action)) {
					scope.cancelAlert.remove();
					$document.off('click', onClickHandler);
					delete scope.action;
					return doneFn(scope);
				}
			}
			
		}

	};
	
}

module.exports = function (ngModule) {
	
	ngModule.directive('pwCancelAction', pwCancelAction);

};
