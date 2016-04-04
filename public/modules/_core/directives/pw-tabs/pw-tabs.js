'use strict';

/* this is the uiTabs module with the possibility to use custom templates */

angular.module('core')
.controller('pwTabgroupCtrl', ['$scope', function ($scope) {
	
	var ctrl = this,
      tabs = ctrl.tabs = $scope.tabs = [];
			
	// we deselect the current active tab & call onDeselect() + select the new active tab & call onSelect()
	ctrl.select = function select (selectedTab) {
		
		angular.forEach(tabs, function(tab) {
      if (tab.active && tab !== selectedTab) {
        tab.active = false;
        tab.onDeselect();
        selectedTab.selectCalled = false;
      }
    });
    selectedTab.active = true;
    // only call select if it has not already been called
    if (!selectedTab.selectCalled) {
      selectedTab.onSelect();
      selectedTab.selectCalled = true;
    }
		
	};
	
	// add tab to the tabs array if not yet there
	ctrl.addTab = function addTab (tab) {
		
		// we only push new tabs
		if (tabs.map(function(x) {return x.id; }).indexOf(tab.id) === -1) {
			tabs.push(tab);
		}
		
    // we can't run the select function on the first tab
    // since that would select it twice, so we select it manually
    if (tabs.length === 1 && tab.active !== false) {
      tab.active = true;
    } else if (tab.active) {
      ctrl.select(tab);
    } else {
      tab.active = false;
    }
		
	};
	
	// we remove a tab & update the active position if the removed tab was active	
	ctrl.removeTab = function removeTab (tab) {
    var index = tabs.indexOf(tab);
    //Select a new tab if the tab to be removed is selected and not destroyed
    if (tab.active && tabs.length > 1 && !destroyed) {
      //If this is the last tab, select the previous tab. else, the next tab.
      var newActiveIndex = index === tabs.length - 1 ? index - 1 : index + 1;
      ctrl.select(tabs[newActiveIndex]);
    }
    tabs.splice(index, 1);
  };

  var destroyed;
  $scope.$on('$destroy', function() {
    destroyed = true;
  });
	
}])

//tab group template
.directive('pwTabgroup', ['$parse', function($parse) {

	return {
		
		restrict: 'E',
		transclude: true,
		template: function (elem, attrs) {
			return  '<div class = "row">' +
								'<div class="col-lg-3">' +
								'</div>' +
								'<div class="col-lg-6 tab-content">' +
									'<div class="tab-pane" ng-repeat="tab in tabs" ng-class="{active: tab.active}" pw-tab-content-transclude="tab"></div>' +
								'</div>' +
								'<div class="col-lg-2">' +
									'<div class="tag-list">' +
										'<div class="tag-list-header"><i class="fa fa-tags"></i>&nbsp&nbspTabs</div>' +
										'<div ng-transclude></div>' +
										'<div class="tag-list-item" ng-show="authentication.user._id === article.user._id && !disableEdit" ng-click="createNewTab()">' +
											'<i class="fa fa-plus"></i>&nbsp&nbspAdd Tab' +
										'</div>' +
									'</div>' +
								'</div>' +
							'</div>';
		},
		controller: 'pwTabgroupCtrl',
		link: function(scope, element, attrs) {
			
			var fn = $parse(attrs.tabgrouponclick);
			
			scope.createNewTab = function () {
				fn(scope);
				scope.select ();
			};
		
		}
		
	};
	
}])

// tab title on the list
.directive('pwTab', ['$parse', function($parse) {

	return {
		
		restrict: 'E',
		scope: {
			heading: '@',
			id: '@',
			active: '=?',
			editMode: '=?',
			deleteTab: '&',
			mergeTabs: '&',
			tabPosition: '&',
			onSelect: '&select', //This callback is called in contentHeadingTransclude once it inserts the tab's content into the dom
      onDeselect: '&deselect'
		},
		transclude: true,
		template: '<div class="tag-list-item" ng-click="select()" ng-class="{isActive: active}" pw-tab-heading-transclude>' +
								'{{ heading }}' +
								'<em class="float-right" ng-show="editMode">' +
									'<i class="fa fa-chevron-up" ng-show="position()!==\'first\'" ng-click="onMerge(\'up\')"></i>' + 
									'<i class="fa fa-chevron-down" ng-show="position()!==\'last\'" ng-click="onMerge(\'down\')"></i>' + 
									'<i class="fa fa-trash" ng-click="onDelete()"></i>' + 
								'</em>' +
							'</div>',
		require: '^pwTabgroup',
		controller: function() {
      //Empty controller so other directives can require being 'under' a tab
    },
    controllerAs: 'tab',
    link: function(scope, element, attrs, tabgroupCtrl, transclude) {
      
			scope.position = function () {
				return scope.tabPosition();
			};
			
			scope.onDelete = function () {
				scope.deleteTab();
			};
			
			scope.onMerge = function (direction) {
				console.log('here');
				scope.mergeTabs({direction: direction});
			};
			
			scope.$watch('active', function(active) {
        if (active) {
          tabgroupCtrl.select(scope);
        }
      });

      scope.disabled = false;
      if (attrs.disable) {
        scope.$parent.$watch($parse(attrs.disable), function(value) {
          scope.disabled = !! value;
        });
      }
			
			// fired on ng-click. Triggers the watch function.
      scope.select = function() {
        if (!scope.disabled) {
          scope.active = true;
        }
      };

      tabgroupCtrl.addTab(scope);
			
      scope.$on('$destroy', function() {
        tabgroupCtrl.removeTab(scope);
      });

      //We need to transclude later, once the content container is ready.
      //when this link happens, we're inside a tab heading.
      scope.$transcludeFn = transclude;
    }
	};
	
}])

.directive('pwTabHeadingTransclude', function() {
  return {
    restrict: 'A',
    require: '^pwTab',
    link: function(scope, elm) {
      scope.$watch('headingElement', function updateHeadingElement(heading) {
        if (heading) {
          elm.html('');
          elm.append(heading);
        }
      });
    }
  };
})

.directive('pwTabContentTransclude', function() {
  return {
    restrict: 'A',
    require: '^pwTabgroup',
    link: function(scope, elm, attrs) {
      var tab = scope.$eval(attrs.pwTabContentTransclude);

      //Now our tab is ready to be transcluded: both the tab heading area
      //and the tab content area are loaded.  Transclude 'em both.
      tab.$transcludeFn(tab.$parent, function(contents) {
        angular.forEach(contents, function(node) {
          if (isTabHeading(node)) {
            //Let tabHeadingTransclude know.
            tab.headingElement = node;
          } else {
            elm.append(node);
          }
        });
      });
    }
  };

  function isTabHeading(node) {
    return node.tagName && (
      node.hasAttribute('pw-tab-heading') ||
      node.hasAttribute('data-pw-tab-heading') ||
      node.hasAttribute('x-pw-tab-heading') ||
      node.tagName.toLowerCase() === 'pw-tab-heading' ||
      node.tagName.toLowerCase() === 'data-pw-tab-heading' ||
      node.tagName.toLowerCase() === 'x-pw-tab-heading'
    );
  }
});