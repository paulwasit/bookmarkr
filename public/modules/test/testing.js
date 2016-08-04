'use strict';

module.exports = function (ngModule) {
	
	ngModule.component('testing', {
		template: require('./testing.html'),
		bindings: {},
		controller: [	function () {
			
			this.$onInit = function () {
				this.panes = [{content:'0'},{content:'1'},{content:'2'},{content:'3'},{content:'4'},{content:'5'}];
				this.selectPane(this.panes[0]);
			};
			
			this.selectPane = function (selectedPane) {
				// unselect all tabs but the selected one
				var activeFound = false;
				angular.forEach(this.panes, function(pane) {
					if (!activeFound) {
						if (pane === selectedPane) activeFound = true;
						pane.swipeClass = (pane === selectedPane) ? "active" : "isLeft";
					}
					else {
						pane.swipeClass = "isRight";
					}
				});		
			}
		}]
	});
};