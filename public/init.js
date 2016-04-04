'use strict';

var appName = ApplicationConfiguration.applicationModuleName,
		appVendorDep = ApplicationConfiguration.applicationModuleVendorDependencies;

//Start by defining the main module and adding the module dependencies
angular.module(appName, appVendorDep);

// Setting HTML5 Location Mode & Disabling ngAnimate on ng-animate-disabled class & disable animations for popover
angular.module(appName).config(['$locationProvider', '$httpProvider', '$animateProvider', '$uibTooltipProvider', '$provide', 'markedProvider',
	function($locationProvider, $httpProvider, $animateProvider, $uibTooltipProvider, $provide, markedProvider) {
		$locationProvider.html5Mode(true).hashPrefix('!');
		$httpProvider.interceptors.push('authInterceptor');
		$animateProvider.classNameFilter(/^(?:(?!ng-animate-disabled).)*$/);
		$uibTooltipProvider.options({ animation: false });
		
		// marked md editor customization
		markedProvider.setOptions({
			sanitize: true,
			gfm: true,
			tables: true,
			highlight: function (code, lang) {
				if (lang) {
					return hljs.highlight(lang, code, true).value;
				} else {
					return hljs.highlightAuto(code).value;
				}
			}
		});
		
		/* textAngular customization */
		$provide.decorator('taOptions', ['taRegisterTool', '$delegate', function(taRegisterTool, taOptions) {
			
			taOptions.setup.htmlEditorSetup = function($element){
				/*$element.attr('ui-codemirror', '');*/
			};
			
			taRegisterTool('save', {
				iconclass: 'fa fa-floppy-o',
				tooltiptext: 'save',
				action: function() {
					/*return this.$editor().wrapSelection("insertHorizontalRule", null);*/
				}
			});
			
			taRegisterTool('HR', {
				iconclass: 'fa fa-minus',
				tooltiptext: 'insert horizontal line',
				action: function() {
					return this.$editor().wrapSelection("insertHorizontalRule", null);
				}
			});
			
			taRegisterTool('code', {
				iconclass: 'fa fa-terminal',
				tooltiptext: 'code',
				action: function() {
					return this.$editor().wrapSelection("formatBlock", '<code>');
				},
				activeState: function(){ return this.$editor().queryFormatBlockState('code'); }
			});
			
			taOptions.toolbar = [
				['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'pre', 'quote', 'code'],
				['bold', 'italics', 'underline', 'strikeThrough'], 
				['ul', 'ol', 'HR'], 
				['redo', 'undo', 'clear'],
				['justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull'], 
				['indent', 'outdent'],
				['html', 'insertImage','insertLink', 'insertVideo'], 
				['save'],
				['wordcount', 'charcount']
			];
			
			return taOptions;

		}]);
		
	}
]);

angular.module(appName).run(function ($rootScope, $state, Authentication) {

  // Check authentication before changing state
  $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
    if (toState.data && toState.data.roles && toState.data.roles.length > 0) {
      var allowed = false;
      toState.data.roles.forEach(function (role) {
        if (Authentication.user.roles !== undefined && Authentication.user.roles.indexOf(role) !== -1) {
          allowed = true;
          return true;
        }
      });

      if (!allowed) {
        event.preventDefault();
        if (Authentication.user !== undefined && typeof Authentication.user === 'object') {
          $state.go('app.forbidden');
        } else {
          $state.go('app.authentication.signin').then(function () {
            storePreviousState(toState, toParams);
          });
        }
      }
    }
  });

  // Record previous state
  $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
    storePreviousState(fromState, fromParams);
  });

  // Store previous state
  function storePreviousState(state, params) {
    // only store this state if it shouldn't be ignored 
    if (!state.data || !state.data.ignoreState) {
      $state.previous = {
        state: state,
        params: params,
        href: $state.href(state, params)
      };
    }
  }
});

//Then define the init function for starting up the application
angular.element(document).ready(function () {
  //Fixing facebook bug with redirect
  if (window.location.hash && window.location.hash === '#_=_') {
    if (window.history && history.pushState) {
      window.history.pushState('', document.title, window.location.pathname);
    } else {
      // Prevent scrolling by storing the page's current scroll offset
      var scroll = {
        top: document.body.scrollTop,
        left: document.body.scrollLeft
      };
      window.location.hash = '';
      // Restore the scroll offset, should be flicker free
      document.body.scrollTop = scroll.top;
      document.body.scrollLeft = scroll.left;
    }
  }

  //Then init the app
  angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});
