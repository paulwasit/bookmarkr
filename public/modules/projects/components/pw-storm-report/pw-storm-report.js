'use strict';

module.exports = function (ngModule) {

	ngModule.component('pwStormReport', {
		template: require('./pw-storm-report.html'),
		bindings: {
			jsonData: '='
		},
		controller: [function () {

			var ctrl = this,
					harmTypes=["cropDmg","Fatalities","Injuries","propDmg"];
			
			// exposed functions
			this.filterByState = filterByState;

			// initialize exposed variables
			this.$onInit = function () {
				this.stateFilter = "Texas";
			};
			
			// functions declaration
			function filterByState (obj) {
				if (obj.stateName == ctrl.stateFilter) return true;
				return false;
			}
		
		}]
		
	});
};