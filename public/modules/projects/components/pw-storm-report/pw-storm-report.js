'use strict';

module.exports = function (ngModule) {

	/*
	ngModule.component('pwStormReport', {
		template: require('./pw-storm-report.html'),
		bindings: {},
		controller: function () {
			
			this.alert = function (msg) {
				console.log(msg);
				//console.log(ctrl.geoChart.data.rows[msg.row].c[0].v);
			};
			
			// initialize exposed variables
			this.$onInit = function () {
				this.alert(this.test);
			};
			
		}
	});
	*/
	
	require('./rest')(ngModule);
	require('~/_misc/pw-click-outside')(ngModule);    // hide the toc when clicking outside on small screens
	require('~/_misc/pw-in-header')(ngModule);
	
	ngModule.component('pwStormReport', {
		template: require('./pw-storm-report.html'),
		bindings: {},
		controller: ['$rootScope', '$timeout', 'StormReport', function ($rootScope, $timeout, StormReport) {
		
			var ctrl = this, 
					years = [1950, 2011];
					
					
			// exposed functions
			this.toggleAsideCollapsed = toggleAsideCollapsed;
			this.selectState = selectState;
			this.switchHarmType = switchHarmType;
			this.updateMatchFields = updateMatchFields;
			this.filterHarmEvents = filterHarmEvents;
			this.buildChartDataObject = buildChartDataObject;
			this.setAxisTicks = setAxisTicks;
			
			this.alert = function (msg) {
				//console.log(ctrl.geoChart.data.rows[msg.row].c[0].v);
			};
			
			// initialize exposed variables
			this.$onInit = function () {
				
				// toggleable values
				this.isAsideCollapsed = true;
				this.isLoading = false;
				
				// db global info
				this.harmTypes=[["Fatalities","Fatalities"],["Injuries","Injuries"],["Property Damage","propDmg"],["Crop Damage","cropDmg"]];
				this.harmTypeNames={Fatalities: "Fatalities",Injuries:"Injuries",propDmg:"Property Damage",cropDmg:"Crop Damage"};
				
				// years slider parameters
				this.yearSlider = {
					min: years[0],
					max: years[1],
					options: {
						floor: years[0],
						ceil:  years[1],
						onEnd: function() {
							ctrl.updateMatchFields ();
						}
					}
				};
				
				// map parameters
				this.geoChart = {
					type: "GeoChart",
					data: {
						"cols": [
							{id: "t", label: "Temp", type: "string"}
						]
					},
					options: {
						region: 'US',
						resolution: "provinces",
						legend: {numberFormat:'short'},
						colorAxis: {colors: ['#EFF3FF', '#084594']},
						//backgroundColor: "#f7f7f7",
						//datalessRegionColor: '#f8bbd0',
						defaultColor: '#f5f5f5'
					}
				};
				
				// states columns parameters
				this.statesChart = {
					type: "ColumnChart",
					data: {
						"cols": [
							{id: "t", label: "Temp", type: "string"}
						]
					},
					options: {
						legend: { position: 'none' },
						vAxis: {format:'short'},
						chartArea: {
							left: 55,
							right: 30,
							top: 10,
							bottom: 30
						}
					}
				};
				
				// states pie chart parameters
				this.statesRatioChart = {
					type: "PieChart",
					data: {
						"cols": [
							{id: "t", label: "Temp", type: "string"}
						]
					},
					options: {
						pieHole: 0.8,
						colors:['rgb(51, 102, 204)', 'rgb(176, 196, 226)'],
						legend: { position: 'none' },
						pieSliceText: 'none',
						//vAxis: {format:'short'},
						chartArea: {
							left: 30,
							right: 30,
							top: 30,
							bottom: 30
						}
					}
				};
				
				// years line chart
				this.eventTypesChart = {
					type: "BarChart",
					data: {
						"cols": [
							{id: "t", label: "Temp", type: "string"}
						]
					},
					options: {
						legend: { position: 'none' },
						hAxis: {format:'short'},
						//hAxis: {title: "Years" , direction:-1, slantedText:true, slantedTextAngle:90 }
						//chartArea: {width: '50%'} 
						chartArea: {
							//left: 55,
							right: 30,
							top: 10,
							bottom: 30
						}
					}
				};
				
				// years line chart
				this.yearChart = {
					type: "AreaChart",
					data: {
						"cols": [
							{id: "t", label: "Temp", type: "string"}
						]
					},
					options: {
						legend: { position: 'none' },
						lineWidth: 1,
						//curveType: 'function',
						vAxis: {
							format:'short',
							viewWindow: { min: 0 }
						},
						hAxis: {format: ''},
						chartArea: {
							left: 55,
							right: 30,
							top: 10,
							bottom: 30
						}
					}
				};
				
				// states list
				this.selectedState = undefined;
				this.states = [
					'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 
					'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 
					'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey',
					'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 
					'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
				];
				
				// starting values
				this.harmType = "Fatalities";
				this.harmEventTypes = [];
				this.selectedHarmEventTypes = {};
				this.matchFields = {};
				this.switchHarmType();
				this.geoChart.options.title = this.harmType + " Blabla";
				
			};
			
			
			// ---------- private: functions declaration ---------- //
			
			function toggleAsideCollapsed (forceTrue) { 
				ctrl.isAsideCollapsed = (typeof(forceTrue) !== 'undefined') ? forceTrue : !ctrl.isAsideCollapsed; 
				//refresh slider if visible
				if (!ctrl.isAsideCollapsed) {
					$timeout(function () {
						$rootScope.$broadcast('rzSliderForceRender');
					});
				}
			}
			
			// select state
			function selectState (item) {
				/*
				// convert value if click on states map
				if (typeof item != "undefined" && typeof item.row != "undefined") item = ctrl.geoChart.data.rows[item.row].c[0].v;
				// remove filter on state if invalid value
				if (typeof item == "undefined" || ctrl.states.indexOf(item) == -1) {
					if (!ctrl.isStateDropdownOpen) {
						ctrl.tmpState = undefined;
						if (typeof ctrl.selectedState != "undefined") {
							console.log("removed");
							ctrl.selectedState = undefined;
						}
					}
				}
				// otherwise, add state filter
				else if (item !== ctrl.selectedState) {
					ctrl.tmpState = item;						
					ctrl.selectedState = item;		
				}
				*/
			}
			
			
			// switch harm type: update events types list + refresh map
			function switchHarmType () {

				switch(ctrl.harmType) {
					case "cropDmg":
						ctrl.harmEventTypes = ["DROUGHT", "EXTREME COLD/WIND CHILL", "FLASH FLOOD", "FLOOD", "FROST/FREEZE", "HAIL", "HURRICANE/TYPHOON", "ICE STORM", "THUNDERSTORM WIND", "OTHER"];
						break;
					case "propDmg":
						ctrl.harmEventTypes = ["FLASH FLOOD", "FLOOD", "HAIL", "HURRICANE/TYPHOON", "STORM SURGE/TIDE", "THUNDERSTORM WIND", "TORNADO", "TROPICAL STORM", "WILDFIRE", "OTHER"];
						break;
					case "Injuries":
						ctrl.harmEventTypes = ["EXCESSIVE HEAT", "FLASH FLOOD", "FLOOD", "HEAT", "ICE STORM", "LIGHTNING", "THUNDERSTORM WIND", "TORNADO", "WILDFIRE", "OTHER"];
						break;
					default:
						ctrl.harmEventTypes = ["EXCESSIVE HEAT", "EXTREME COLD/WIND CHILL", "FLASH FLOOD", "FLOOD", "HEAT", "LIGHTNING", "RIP CURRENT", "THUNDERSTORM WIND", "TORNADO", "OTHER"];
				}
				
				// propDmg > 10000 to make the db call faster (we only lose 0.2% of the total)
				ctrl.matchFields = {};
				if (ctrl.harmType === "propDmg") {
					ctrl.matchFields[ctrl.harmType] = { $gt: 10000 };
				}
				else {
					ctrl.matchFields[ctrl.harmType] = { $gt: 0 };
				}
				
				// populate checkboxes
				ctrl.selectedHarmEventTypes = {};
				for (var i=0,l=ctrl.harmEventTypes.length;i<l;i++) { ctrl.selectedHarmEventTypes[ctrl.harmEventTypes[i]]=true; }
				
				// prepare & execute new db query
				ctrl.updateMatchFields();

			}
			
			
			// update the filter of collection documents
			function updateMatchFields () {
				
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
				}
				
				// push selected event types in an array
				var eventTypes = [],
						eventField = ctrl.harmType + "Top10";
				for (var i=0,l=ctrl.harmEventTypes.length;i<l;i++) {
					if (ctrl.selectedHarmEventTypes[ctrl.harmEventTypes[i]]==true) eventTypes.push(ctrl.harmEventTypes[i]);
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
			
			
			// get results & format them for the geochart
			function filterHarmEvents (harmType, matchFields) {

				// format query
				var matchFields = (Object.keys(matchFields).length != 0) ? JSON.stringify(matchFields) : undefined,
						harmType = JSON.stringify("$" + harmType);

				// execute query
				return StormReport.get({ fields: matchFields, harmType: harmType }).$promise.then(function (result) {

					// get total harm
					ctrl.totalHarm = JSON.parse(result['totalHarm'])["0"].totalHarm;
					
					// build map data
					data = buildChartDataObject(result['statesMap'], { _id: ['State', 'string'] , totalHarm: [ctrl.harmType, 'number'] });
					ctrl.geoChart.data = data;
					
					// build states data
					var displayedStates = 5, topHarm = 0, 
							data = JSON.parse(result['statesMap']).slice(0,displayedStates);
					// calculate top harm
					for (var i=0;i<displayedStates; i++) { topHarm += data[i].totalHarm}
					//data.push({ _id: "Others", totalHarm: ctrl.totalHarm - topHarm});
					data = buildChartDataObject(JSON.stringify(data), { _id: ['State', 'string'] , totalHarm: [ctrl.harmType, 'number'] });
					ctrl.statesChart.data = data;
					
					// build states ratio data
					ctrl.topHarmRatio = Math.round(topHarm/ctrl.totalHarm*100,1) + "%";
					data = [
						{ _id: "Top 5", totalHarm: topHarm},
						{ _id: "Others", totalHarm: ctrl.totalHarm - topHarm}
					];
					data = buildChartDataObject(JSON.stringify(data), { _id: ['State', 'string'] , totalHarm: [ctrl.harmType, 'number'] });
					ctrl.statesRatioChart.data = data;
					
					// build years data
					data = buildChartDataObject(result['years'], { _id: ['Year', 'number'] , totalHarm: [ctrl.harmType, 'number'] });
					ctrl.yearChart.data = data;
					
					// adapt years only when active years filter (to show the whole period otherwise)
					if (typeof matchFields !== "undefined" && typeof JSON.parse(matchFields).year !== "undefined") {
						ctrl.yearChart.options.hAxis.ticks = ctrl.setAxisTicks(result['years'], '_id', 10);
					}
					else {
						ctrl.yearChart.options.hAxis.ticks = ctrl.setAxisTicks('[{"_id":' + years[0] + '},{"_id":' + years[1] + '}]', '_id', 10);
					}
					
					// build event types data
					data = buildChartDataObject(result['eventTypes'], { _id: [ctrl.harmType + "Top10", 'string'] , totalHarm: [ctrl.harmType, 'number'] });
					ctrl.eventTypesChart.data = data;
					
				});
			}
			
			// build chart data object
			function buildChartDataObject (source, headers) {
				
				source = JSON.parse(source);
				var data = {
					cols: [],
					rows: []
				};
				
				// column headers
				var newCol, header, colNames = [], colId = 1;
				for (var key in headers) {
					if (!headers.hasOwnProperty(key)) continue;
					header  = headers[key];
					if (header !== 0) {
						newCol = {
							id: colId,
							label: header[0],
							type:  header[1]
						};
						data.cols.push(newCol);
						colNames.push(key);
						colId ++;
					}
				}
				
				// rows
				var newRow, newRowCol;
				for (var i=0,l=source.length; i < l ; i++) {
					newRow = { c: [] };
					for (var j=0,k=colNames.length; j < k ; j++) {
						newRowCol = { v: source[i][colNames[j]] }
						newRow.c.push(newRowCol);
					}
					data.rows.push(newRow);
				}
				
				return data;
				
			}
			
			function setAxisTicks (source, variable, step) {
				source = JSON.parse(source);
				var ticks = [], minValue = Infinity, maxValue = -Infinity, tmpValue;
				
				for (var i=0,l=source.length; i < l ; i++) {
					tmpValue = source[i][variable];
					if (tmpValue < minValue) minValue = tmpValue;
					if (tmpValue > maxValue) maxValue = tmpValue;
				}
				
				var minTick = Math.ceil(minValue/step),
						maxTick = Math.floor(maxValue/step);
						
				for (i=minTick; i <= maxTick ; i++) {
					ticks.push(i*step);
				}
				
				return ticks;
				
			}
			
			
			// broadcast
			$rootScope.$on('cfpLoadingBar:started', function($event, $element, $target){
				ctrl.isLoading = true;
			});
			$rootScope.$on('cfpLoadingBar:completed', function($event, $element, $target){
				ctrl.isLoading = false;
			});
			
		}]
		
	});
	
};
