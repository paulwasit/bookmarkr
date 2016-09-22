'use strict';

module.exports = function (ngModule) {
	
	ngModule.component('pwContact', {
		template: require('./pw-contact.html'),
		bindings: {},
		controller: [function () {
		
			var ctrl = this;
			
			// exposed functions
			//this.toggleAsideCollapsed = toggleAsideCollapsed;
			
			// initialize exposed variables
			this.$onInit = function () {};
			
			
			// ---------- private: functions declaration ---------- //
			
			//function toggleAsideCollapsed () {}
			
			
			// broadcast
			/*
			$rootScope.$on('cfpLoadingBar:started', function($event, $element, $target){
				ctrl.isLoading = true;
			});
			$rootScope.$on('cfpLoadingBar:completed', function($event, $element, $target){
				ctrl.isLoading = false;
			});
			*/
			
		}]
		
	});
	
};
