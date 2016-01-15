'use strict';

angular.module('shows')
.factory('Category', ['$resource', function CategoryFactory($resource) {
  
  return $resource('/api/categories/:id', {}, {});
  
}]);