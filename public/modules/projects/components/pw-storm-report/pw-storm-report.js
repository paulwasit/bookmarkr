'use strict';

module.exports = function (ngModule) {

	require('./rest')(ngModule);
	
	ngModule.component('pwStormReport', {
		template: require('./pw-storm-report.html'),
		bindings: {},
		controller: ['StormReport', function (StormReport) {
		
			var ctrl = this, 
					years = [1950, 2011];
			
			// exposed functions
			this.switchHarmType = switchHarmType;
			this.updateMatchFields = updateMatchFields;
			this.filterHarmEvents = filterHarmEvents;
			this.buildChartDataObject = buildChartDataObject;
			this.setAxisTicks = setAxisTicks;
			
			this.alert = function (msg) {
				console.log(ctrl.geoChart.data.rows[msg.row].c[0].v);
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
						hAxis: {format:'short'},
					}
				};
				
				// years line chart
				this.yearChart = {
					type: "LineChart",
					data: {
						"cols": [
							{id: "t", label: "Temp", type: "string"}
						]
					},
					options: {
						legend: { position: 'none' },
						curveType: 'function',
						vAxis: {format:'short'},
						hAxis: {format: ''}
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
						chartArea: {width: '50%'} 
					}
				};
				
				// starting values
				this.harmType = "Fatalities";
				this.harmEventTypes = [];
				this.selectedHarmEventTypes = {};
				this.matchFields = {};
				this.switchHarmType();
				this.geoChart.options.title = this.harmType + " Blabla";
				
			};
			
			
			// ---------- private: functions declaration ---------- //
			
			// switch harm type: update events types list + refresh map
			function switchHarmType () {
				return StormReport.query({ harmTypeSwitch: ctrl.harmType }).$promise.then(function (result) {
					// reset variables;
					ctrl.harmEventTypes = [];
					ctrl.selectedHarmEventTypes = {};
					ctrl.matchFields = {};
					// propDmg > 10000 to make the db call faster (we only lose 0.2% of the total)
					if (ctrl.harmType === "propDmg") {
						ctrl.matchFields[ctrl.harmType] = { $gt: 10000 };
					}
					else {
						ctrl.matchFields[ctrl.harmType] = { $gt: 0 };
					}
					var harmEventType;
					// loop over event types (other is pushed to the end of the array to appear last in the checkbox list
					for (var i=0,l=result.length;i<l;i++) {
						harmEventType = result[i];
						if (harmEventType !== "OTHER") ctrl.harmEventTypes.push(harmEventType);
						ctrl.selectedHarmEventTypes[harmEventType]=true;
					}
					ctrl.harmEventTypes.sort();
					ctrl.harmEventTypes.push("OTHER");
					console.log(ctrl.harmEventTypes);
					// prepare & execute new db query
					ctrl.updateMatchFields();
				});
			}
			
			
			
			// update the filter of collection documents
			function updateMatchFields (field) {
				
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

					// build map data
					var data = buildChartDataObject(result['statesMap'], { _id: ['State', 'string'] , totalHarm: [ctrl.harmType, 'number'] });
					ctrl.geoChart.data = data;
					
					// build states data
					ctrl.statesChart.data = data;
					
					// build years data
					var data = buildChartDataObject(result['years'], { _id: ['Year', 'number'] , totalHarm: [ctrl.harmType, 'number'] });
					ctrl.yearChart.data = data;
					
					// adapt years only when active years filter (to show the whole period otherwise)
					if (typeof matchFields !== "undefined" && typeof JSON.parse(matchFields).year !== "undefined") {
						ctrl.yearChart.options.hAxis.ticks = ctrl.setAxisTicks(result['years'], '_id', 10);
					}
					else {
						ctrl.yearChart.options.hAxis.ticks = ctrl.setAxisTicks('[{"_id":' + years[0] + '},{"_id":' + years[1] + '}]', '_id', 10);
					}
					
					// build years data
					var data = buildChartDataObject(result['eventTypes'], { _id: [ctrl.harmType + "Top10", 'string'] , totalHarm: [ctrl.harmType, 'number'] });
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
			
		}]
		
	});
};
