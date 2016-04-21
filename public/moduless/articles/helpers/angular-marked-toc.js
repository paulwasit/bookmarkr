
'use strict';

module.exports = 'marked_toc';

angular.module('marked_toc', [])

.provider('marked_toc', function () {
	
  var self = this;
	
  self.setRenderer = function (opts) {
    this.renderer = opts;
  };
	
  self.setOptions = function (opts) {  // Store options for later
    this.defaults = opts;
  };

  self.$get = ['$log', '$window', function ($log, $window) {
    var m = require('./marked-toc');
    m.setOptions(self.defaults);
    return m;
  }];
})

.directive('markedtoc', ['$compile', 'marked_toc', function ($compile, marked_toc) {
  return {
    restrict: 'E',
		
    scope: {
      opts: '=',
      toc: '=',
    },
		
    link: function (scope, element, attrs) {
			
      set(scope.toc || '');
			//scope.$watch('toc', set);
			
			function build (src, depth) {
				var currentLevel = src.shift(), 
						out='';
				// recursively build each new branch 
				if (currentLevel.depth > depth) {
					out+='<ul>\n';
					//out+='<li>\n<a href="#' + currentLevel.id + '" ng-click="scrollTo(\'' + currentLevel.id + '\')">' + currentLevel.title + '</a>\n';
					out+='<li>\n<a href="#' + currentLevel.id + '" du-smooth-scroll du-scrollspy>' + currentLevel.title + '</a>\n';
					while (typeof src[0] !== 'undefined' && src[0].depth >= currentLevel.depth) {
						if (src[0].depth === currentLevel.depth) {
							var newLevel = src.shift();
							//out+='</li>\n<li>\n<a href="#' + newLevel.id + '" ng-click="scrollTo(\'' + newLevel.id + '\')">' + newLevel.title + '</a>\n';
							out+='</li>\n<li>\n<a href="#' + newLevel.id + '" du-smooth-scroll du-scrollspy>' + newLevel.title + '</a>\n';
						}
						else if (src[0].depth > currentLevel.depth) {
							out+=build(src, currentLevel.depth);
						}
					}
					out+='</li>\n</ul>\n';			
				}
				return out;
			}
	
      function set (text) {
				var toc = marked_toc(text, scope.opts || null),
						out = '';
				while (toc.length > 0) {
					out+=build (toc, 0);
				}
				element.html(out);
				$compile(element.contents())(scope);
      }
			
    }
  };
}]);
