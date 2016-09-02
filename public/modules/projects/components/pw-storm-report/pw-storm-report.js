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
			this.alert = function (msg) {
				alert(msg);
			};
			
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
						resolution: "provinces",
						legend: {numberFormat:'short'},
						colorAxis: {colors: ['#EFF3FF', '#084594']},
						backgroundColor: "#f7f7f7",
						//datalessRegionColor: '#f8bbd0',
						defaultColor: '#f5f5f5'
					}
				};
				
				// starting values
				this.harmType = "Fatalities";
				this.harmEventTypes = [];
				this.selectedHarmEventTypes = {};
				this.matchFields = {};
				this.geoChart.options.title = this.harmType + " Blabla";
				this.switchHarmType();
				
			};
			
			
			// ---------- private: functions declaration ---------- //
			
			// switch harm type: update events types list + refresh map
			function switchHarmType () {
				return StormReport.query({ harmTypeSwitch: ctrl.harmType }).$promise.then(function (result) {
					ctrl.harmEventTypes = result;
					ctrl.selectedHarmEventTypes = {};
					for (var i=0,l=ctrl.harmEventTypes.length;i<l;i++) {
						ctrl.selectedHarmEventTypes[ctrl.harmEventTypes[i]._id]=true;
					}
					ctrl.updateMatchFields("harmEventTypes");
				});
			}
			
			
			
			// update the filter of collection documents
			function updateMatchFields (field) {
				if (field == "year") {
					// build new year filter
					var year = {};
					if (ctrl.yearSlider.min > years[0]) year["$gte"] = ctrl.yearSlider.min;
					if (ctrl.yearSlider.max < years[1]) year["$lte"] = ctrl.yearSlider.max;
					
					// update matchFields if not the same value as before (angular.equals does not work with prop starting with $)
					if (typeof ctrl.matchFields.year == "undefined" || year["$lte"] !== ctrl.matchFields.year["$lte"] || year["$gte"] !== ctrl.matchFields.year["$gte"]) {
						if (Object.keys(year).length == 0) {
							delete ctrl.matchFields.year;
						}
						else {
							ctrl.matchFields.year = year;
						}
						ctrl.filterHarmEvents(ctrl.harmType, ctrl.matchFields);
					}
				}
				else if (field == "harmEventTypes") {
					// push selected event types in an array
					var eventTypes = [],
							eventField = ctrl.harmType + "Top10";
					for (var i=0,l=ctrl.harmEventTypes.length;i<l;i++) {
						if (ctrl.selectedHarmEventTypes[ctrl.harmEventTypes[i]._id]==true) eventTypes.push(ctrl.harmEventTypes[i]._id);
					}
					// delete filter if all event types are selected
					if (eventTypes.length === 10) {
						delete ctrl.matchFields[eventField];
					}
					// add filter field otherwise
					else {
						ctrl.matchFields[eventField] = { $in: eventTypes };
					}
					ctrl.filterHarmEvents(ctrl.harmType, ctrl.matchFields);
				}
			}
			
			// get results & format them for the geochart
			function filterHarmEvents (harmType, matchFields) {
				var matchFields = (Object.keys(matchFields).length != 0) ? JSON.stringify(matchFields) : undefined,
					harmType = JSON.stringify("$" + harmType);

				return StormReport.query({ fields: matchFields, harmType: harmType }).$promise.then(function (result) {
					result[0] = JSON.parse(result[0]);
					var newRow, rows = [];
					for (var i=0,l=result[0].length; i < l ; i++) {
						newRow = {
							c: [
								{v: result[0][i].stateName},
								{v: result[0][i].totalHarm}
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
