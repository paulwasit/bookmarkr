'use strict';

module.exports = function (ngModule) {

	require('./rest')(ngModule);
	
	ngModule.component('pwStormReport', {
		template: require('./pw-storm-report.html'),
		bindings: {
			jsonData: '='
		},
		controller: ['StormReport', function (StormReport) {
		
			var ctrl = this, 
					years = [1950, 2011];
			
			// exposed functions
			this.switchHarmType = switchHarmType;
			this.updateMatchFields = updateMatchFields;
			this.filterHarmEvents = filterHarmEvents;
			
			// initialize exposed variables
			this.$onInit = function () {
				
				// db global info
				this.harmTypes=["cropDmg","Fatalities","Injuries","propDmg"];
				
				// years slider parameters
				this.yearSlider = {
					min: years[0],
					max: years[1],
					options: {
						floor: years[0],
						ceil:  years[1],
						onEnd: function() {
							ctrl.updateMatchFields ("year");
						}
					}
				};
				
				// map parameters
				this.geoChart = {
					type: "GeoChart",
					data: {
						"cols": [
							{id: "t", label: "State", type: "string"},
							{id: "s", label: "Harm", type: "number"}
						]
					},
					options: {
						region: 'US',
						resolution: "provinces"
					}
				};
				
				// starting values
				this.harmType = "Fatalities";
				this.harmEvents = [];
				this.matchFields = {};
				this.geoChart.options.title = this.harmType + " Blabla";
				this.switchHarmType();
				
			};
			
			
			// ---------- private: functions declaration ---------- //
			
			// switch harm type: update events types list + refresh map
			function switchHarmType () {
				console.log("switch type");
				return StormReport.query({ harmTypeSwitch: ctrl.harmType }).$promise.then(function (result) {
					console.log(result);
					ctrl.harmEvents = result;
					ctrl.filterHarmEvents (ctrl.harmType, ctrl.matchFields);
				});
				
				
			}
			
			// update the filter of collection documents
			function updateMatchFields (field) {
				console.log("updateMatch");
				if (field == "year") {
					// build new year filter
					var year = {};
					if (ctrl.yearSlider.min > years[0]) year["$gte"] = ctrl.yearSlider.min;
					if (ctrl.yearSlider.max < years[1]) year["$lte"] = ctrl.yearSlider.max;
					
					// update matchFields if not the same value as before (angular.equals does not work with prop starting with $)
					if (typeof ctrl.matchFields.year == "undefined" || year["$lte"] !== ctrl.matchFields.year["$lte"] || year["$gte"] !== ctrl.matchFields.year["$gte"]) {
						console.log("trigger");
						if (Object.keys(year).length == 0) {
							delete ctrl.matchFields.year;
						}
						else {
							ctrl.matchFields.year = year;
						}
						ctrl.filterHarmEvents(ctrl.harmType, ctrl.matchFields);
					}
					
				}
			}
			
			// get results & format them for the geochart
			function filterHarmEvents (harmType, matchFields) {
				console.log("filter");
				var matchFields = (Object.keys(matchFields).length != 0) ? JSON.stringify(matchFields) : undefined,
					harmType = JSON.stringify("$" + harmType);

				return StormReport.query({ fields: matchFields, harmType: harmType }).$promise.then(function (result) {
					var newRow, rows = [];
					for (var i=0,l=result.length; i < l ; i++) {
						newRow = {
							c: [
								{v: result[i].stateName},
								{v: result[i].totalHarm}
							]
						};
						rows.push(newRow)
					}
					ctrl.geoChart.data.rows = rows;
				});
			}
			
		}]
		
	});
};
