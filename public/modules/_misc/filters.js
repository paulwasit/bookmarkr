'use strict';

module.exports = function (ngModule) {
	
	// uses moment.js with an angularJS value that will be 'filtered'
	ngModule.filter('fromNow', ['moment', function(moment) {
		return function(date) {
			return moment(date).fromNow();
		};
	}])

	.filter('isTagIn', ['$filter', function($filter){
		return function(items, activeTags){
			if(activeTags){
				return $filter('filter')(items, function(item){
						
					for (var i=0; i < activeTags.length; i++) {
						if(item.tags.indexOf(activeTags[i]) === -1) {
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

};