'use strict';

module.exports = function (ngModule) {
	
	require('~/users/helpers/show-errors')(ngModule); 
	
	ngModule.component('pwContact', {
		template: require('./pw-contact.html'),
		bindings: {},
		controller: ["$rootScope", "$location", "$http", "$timeout", function ($rootScope, $location, $http, $timeout) {
		
			var ctrl = this;
			
			// exposed functions
			this.submitAction = submitAction;
			
			// initialize exposed variables
			this.$onInit = function () {
				this.contact = {};
				this.error = $location.search().err;
			};
			
			
			// ---------- private: functions declaration ---------- //
			
			function submitAction (isValid) {
				
				ctrl.success = ctrl.error = null;
				if (!isValid) {
					$rootScope.$broadcast('show-errors-check-validity', '$ctrl.userForm');
					return false;
				}
				
				ctrl.pending = true;
				
				$http.post('/api/contact/sendEmail', ctrl.contact)
				.then(function(response) {
					ctrl.pending = false;
					ctrl.contact = {};
					ctrl.userForm.$setPristine();
					ctrl.success = response.data.message;  // Show user success message
				})
				.catch(function(response) {
					console.log('error: ', response);
					ctrl.pending = false;
					ctrl.userform = null;					    // Clear form and clear form
					ctrl.error = response.data.message;    // Show user error message
				});
				
			}
			
		}]
		
	});
	
};
