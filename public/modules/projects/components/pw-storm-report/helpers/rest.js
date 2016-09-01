'use strict';

module.exports = function ($q, $http) {

	var deferred = $q.defer();
	var promises = [];
	
	var harmTypes=["cropDmg","Fatalities","Injuries","propDmg"];
	for (var i=0;i<4;i++) {
		promises.push(
			$http.get("./modules/projects/components/pw-storm-report/assets/data/"+harmTypes[i]+".json")
		);
	}
	
	$q.all(promises)
	.then(
		function(results) {
			deferred.resolve(results);
		},
		function(errors) {
			deferred.reject(errors);
		}
	);
	return deferred.promise;
	
};