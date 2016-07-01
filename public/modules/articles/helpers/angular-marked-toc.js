
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
      tabBody: '=',
			onclick: '&',
			isEditMode: "="
    },
    link: function (scope, element, attrs) {
			
			scope.$watch('isEditMode', function(newValue, oldValue){
				// first call
				if (newValue === oldValue && typeof scope.toc === 'undefined') {
					scope.toc = setToc(scope.tabBody || '');
					return updateToc();
				}
				// on edit (the textarea has ng-model-options debounce to prevent constant updates)
				if (newValue) {
					scope.$watch('tabBody', function(newValue, oldValue){
						if (newValue !== oldValue) {
							var tempToc = setToc(scope.tabBody || '');
							if (tempToc !== scope.toc) {
								scope.toc = tempToc;
								return updateToc();
							}
						}
					});
				}
			});
			
			function build (src, depth) {
				var currentLevel = src.shift(), 
						out='';
				// recursively build each new branch 
				if (currentLevel.depth > depth) {
					out+='<ul>\n';
					//out+='<li>\n<a href="#' + currentLevel.id + '" ng-click="scrollTo(\'' + currentLevel.id + '\')">' + currentLevel.title + '</a>\n';
					out+='<li>\n<a href="#' + currentLevel.id + '" ng-click=onclick() du-smooth-scroll du-scrollspy>' + currentLevel.title + '</a>\n';
					while (typeof src[0] !== 'undefined' && src[0].depth >= currentLevel.depth) {
						if (src[0].depth === currentLevel.depth) {
							var newLevel = src.shift();
							//out+='</li>\n<li>\n<a href="#' + newLevel.id + '" ng-click="scrollTo(\'' + newLevel.id + '\')">' + newLevel.title + '</a>\n';
							out+='</li>\n<li>\n<a href="#' + newLevel.id + '" ng-click=onclick() du-smooth-scroll du-scrollspy>' + newLevel.title + '</a>\n';
						}
						else if (src[0].depth > currentLevel.depth) {
							out+=build(src, currentLevel.depth);
						}
					}
					out+='</li>\n</ul>\n';			
				}
				return out;
			}
			
      function setToc (text) {
				var toc = marked_toc(text, scope.opts || null),
						out = '';
				while (toc.length > 0) {
					out+=build (toc, 0);
				}
				return out;
			}
			
			function updateToc () {
				element.html(scope.toc);
				$compile(element.contents())(scope);
      }
			
    }
  };
	
}]);
