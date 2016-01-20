'use strict';

angular.module('articles')
.directive('pwArticleCreate', ['$location', 'Articles',
function($location, Articles) {
  return {
    restrict: 'E',
    templateUrl: 'modules/articles/directives/pw-article-create/pw-article-create.html',
		scope: {},
		link: function(scope, element, attrs) {
			
			//scope.orightml = '<h2>Try me!</h2><p>textAngular is a super cool WYSIWYG Text Editor directive for AngularJS</p><p><img class="ta-insert-video" ta-insert-video="http://www.youtube.com/embed/2maA1-mvicY" src="" allowfullscreen="true" width="300" frameborder="0" height="250"/></p><p><b>Features:</b></p><ol><li>Automatic Seamless Two-Way-Binding</li><li>Super Easy <b>Theming</b> Options</li><li style="color: green;">Simple Editor Instance Creation</li><li>Safely Parses Html for Custom Toolbar Icons</li><li class="text-danger">Doesn&apos;t Use an iFrame</li><li>Works with Firefox, Chrome, and IE9+</li></ol><p><b>Code at GitHub:</b> <a href="https://github.com/fraywing/textAngular">Here</a> </p><h4>Supports non-latin Characters</h4><p>昮朐 魡 燚璒瘭 譾躒鑅, 皾籈譧 紵脭脧 逯郹酟 煃 瑐瑍, 踆跾踄 趡趛踠 顣飁 廞 熥獘 豥 蔰蝯蝺 廦廥彋 蕍蕧螛 溹溦 幨懅憴 妎岓岕 緁, 滍 蘹蠮 蟷蠉蟼 鱐鱍鱕, 阰刲 鞮鞢騉 烳牼翐 魡 骱 銇韎餀 媓幁惁 嵉愊惵 蛶觢, 犝獫 嶵嶯幯 縓罃蔾 魵 踄 罃蔾 獿譿躐 峷敊浭, 媓幁 黐曮禷 椵楘溍 輗 漀 摲摓 墐墆墏 捃挸栚 蛣袹跜, 岓岕 溿 斶檎檦 匢奾灱 逜郰傃</p>';
			//scope.content = scope.orightml;
			scope.disabled = false;
			
			scope.create = function(isValid) {
				
				scope.error = null;
				
				if (!isValid) {
					scope.$broadcast('show-errors-check-validity', 'articleForm');
					return false;
				}
				
				var article = new Articles({
					title: scope.title,
					content: [{body: scope.content}]
				});

				article.$save(
				function(response) {
					scope.title = '';
					scope.content = '';
					$location.path('articles/' + response._id);
				},
				function(errorResponse) {
					scope.error = errorResponse.data.message;
				});
			};
			
    }
  };
}]);