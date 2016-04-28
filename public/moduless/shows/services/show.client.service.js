'use strict';

angular.module('shows').factory('Show', ['$resource', 
	function ($resource) {
  	return $resource('/api/shows/:id', {}, { update: {	method: 'PUT' }	});
  }
]);