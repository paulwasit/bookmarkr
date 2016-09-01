'use strict';

module.exports = function ($q, $http) {

	var deferred = $q.defer();
	var promises = [];
	
	for (var i=0;i<5;i++) {
		promises.push(
			$http.get("./modules/projects/components/pw-smart-keyboard/assets/data/en_US.10.freq.10.fast."+i+".json")
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