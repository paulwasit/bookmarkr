'use strict';

// uses moment.js with an angularJS value that will be 'filtered'
angular.module('core').filter('fromNow', ['moment', function(moment) {
	return function(date) {
		return moment(date).fromNow();
	};
}])

.filter('isGenreIn', ['$filter', function($filter){
	return function(shows, activeGenres){
		if(activeGenres){
			return $filter('filter')(shows, function(show){
					
				for (var i=0; i < activeGenres.length; i++) {
					if(show.genre.indexOf(activeGenres[i]) === -1) {
						return false;
					}
				}
				
				return true;
				
			});
		}
	};
}])

.filter('htmlToPlainText', function() {
	return function(text) {
		return  text ? String(text).replace(/<[^>]+>/gm, '') : '';
	};
});
