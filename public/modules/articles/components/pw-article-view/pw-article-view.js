'use strict';

module.exports = function (ngModule) {

	require('./pw-arv-buttons/pw-arv-buttons')(ngModule); 		
	require('./pw-arv-content/pw-arv-content')(ngModule); 	
	require('./pw-arv-aside/pw-arv-aside')(ngModule); 
	
	var modalTemplate = require('~/_misc/pw-modal-template');
	require('~/_misc/pw-gif')(ngModule);
	
	ngModule.component('pwArticleView', {
		template: require('./pw-article-view.html'),
		bindings: {
			article: '=',
			isProject: "@"
		},
		controller: ['$rootScope', '$state', '$document', '$interval', '$timeout', '$animate', 'Authentication', 'Articles', 'Notification',
		function ($rootScope, $state, $document, $interval, $timeout, $animate, Authentication, Articles, Notification) {
			
			var ctrl = this,
					fullScreenFn = 
						(document.documentElement.requestFullscreen && 'requestFullscreen') ||
						(document.documentElement.mozRequestFullScreen && 'mozRequestFullScreen') ||
						(document.documentElement.webkitRequestFullscreen && 'webkitRequestFullscreen') ||
						(document.documentElement.msRequestFullscreen && 'msRequestFullscreen'),
					cancelFullscreenFn = 
						(document.cancelFullScreen && 'cancelFullScreen') ||
						(document.mozCancelFullScreen && 'mozCancelFullScreen') ||
						(document.webkitExitFullscreen && 'webkitExitFullscreen') ||
						(document.msExitFullscreen && 'msExitFullscreen');
					fsChangeFns = [
						'fullscreenchange', 
						'webkitfullscreenchange', 
						'mozfullscreenchange', 
						'MSFullscreenChange'
					];
					
			fsChangeFns.forEach(function addFullScreenChangeEvtListener(fsEvtName) {
				document.addEventListener(fsEvtName, function() {
					$timeout(function() {
						ctrl.isFullScreen = !ctrl.isFullScreen; 
					});
				}, false);
			});
			
			// exposed functions - used by children components
			this.toggleAsideCollapsed = toggleAsideCollapsed;
			this.toggleEditMode = toggleEditMode;
			this.toggleFullScreen = toggleFullScreen;
			
			this.position = tabPosition;
			this.select = selectTab;
			this.onSwipe = onSwipe;     // switch between tabs on swipe
			
			this.updateFn = updateFn;
			
			// Timer start function.
			this.startTimer = function () {
				this.Timer = $interval(this.updateFn.bind(this), 10000);
			}
	 
			// Timer stop function.
			this.stopTimer = function () {
				if (angular.isDefined(this.Timer)) $interval.cancel(this.Timer);
			}
			
			
			// initialize exposed variables
			this.$onInit = function () {
				
				// check if called from projects
				this.isProjectView = !(typeof this.isProject === "undefined");
				
				// articleOld saves the previous value of the article when running the interval save fn;
				// if no change, the server update fn is not called (limits calls to server)
				this.articleOld = false;
			
				// timer for periodic updates
				this.Timer = null;
			
				// only the article author can modify it
				this.isAuthor = Authentication.user._id === this.article.user._id;
				
				// set the first tab as active
				this.activeTab = this.article.content[0];
				this.activeTab.active = true;
				this.activeTab.swipeClass = "active";
				//this.select(this.article.content[0], true);
				
				// toggleable values
				this.isAsideCollapsed = true;
				this.isEditMode = false;
				this.isFullScreen = false;
				this.isCodeMirror = true; // trigger codemirror refresh
				
				// params for reorganizing tabs position
				this.sortableConfig = sortableConfig;
				
			};
			
			// Save when leaving the page
			this.$onDestroy = function () {
				if (this.isEditMode) {
					this.updateFn();
					this.stopTimer();
				}
			};

			
			////////////

			
			var sortableConfig = {
				ghostClass: "article-toc-ghost",
				animation: 150,
				disabled: true,
				onSort: function (evt){}
			};
			
			// trigger slide fullscreen
			function toggleAsideCollapsed (forceTrue) { 
				this.isAsideCollapsed = (typeof(forceTrue) !== 'undefined') ? forceTrue : !this.isAsideCollapsed; 
			}
			
			// toggle edit mode
			function toggleEditMode () { 
				this.isEditMode = !this.isEditMode;
				this.sortableConfig.disabled = !this.sortableConfig.disabled;
				if (this.isEditMode) {
					this.startTimer();
				}
				else {
					this.updateFn();
					this.stopTimer();
					// allows the scrollspy to reset when leaving the edit mode
					// this is necessary because the ng-if destroys the scope previously used to spy on elements
					$rootScope.$broadcast('$locationChangeSuccess'); 
				}
			}
			
			// toggle slide fullscreen
			function toggleFullScreen () {
				if (!this.isFullScreen) {
					document.documentElement[fullScreenFn]();
				}
				else {
					document[cancelFullscreenFn]();
				}
			}
			
			// tab position in the tabs array: first, empty or last
			function tabPosition (tab, returnIdx) {
				var idx = this.article.content.indexOf(tab);
				if (typeof returnIdx !== 'undefined') return idx;
				return (idx === 0) ? 'first' : 
							 (idx === this.article.content.length - 1) ? 'last' : undefined;
			}
			
			
			// tabs selection
			
			function selectTab (selectedTab, isCalledFromInside) {
				
				// close the toc
				this.isAsideCollapsed = true; 
				// unselect all tabs but the selected one
				var activeIdx = this.position(this.activeTab, true),
						nextIdx = this.position(selectedTab, true);
				
				
				if (activeIdx === nextIdx) return;
				
				if (selectedTab === 'prev') {
					nextIdx = activeIdx - 1;
					if (nextIdx < 0) return;
					selectedTab = this.article.content[nextIdx];
				}
				else if (selectedTab === 'next') {
					nextIdx = activeIdx + 1;
					if (nextIdx === this.article.content.length) return;
					selectedTab = this.article.content[nextIdx];
				}
				
				// switch classes
				// scroll to top when click on tab title
				isCalledFromInside = (typeof isCalledFromInside === 'undefined') ? false : true;
				if (isCalledFromInside) {
					angular.forEach(this.article.content, function(tab) {
						if (tab === selectedTab) {
							tab.active = true;
							tab.swipeClass = "active";
						}
						else {
							tab.active = false;
							tab.swipeClass = "";
						}
					});
					
					selectedTab.active = true;
					if (ctrl.activeTab) ctrl.activeTab.active = false;
				
				}
				
				else {
					// get swipe direction
					var swipeDirection = (activeIdx < nextIdx) ? 'fromRight' : 'fromLeft';
					// update direction classes
					angular.forEach(this.article.content, function(tab) {
						if (tab === ctrl.activeTab) {
							tab.swipeClass = "inactive " + swipeDirection;
							ctrl.activeTab = tab;
						}
						else if (tab === selectedTab) {
							tab.swipeClass = "active " + swipeDirection;
							tab.active = true;
						}
						else {
							tab.active = false;
							tab.swipeClass = "";
						}
					});

					//$document.scrollTop(450);
					//$document.scrollTop(0, 300); 
					//if (!this.article.isSlide)  
					$timeout(function () {
						angular.forEach(ctrl.article.content, function(tab) {
							if (tab.swipeClass === "inactive " + swipeDirection) {
								tab.active = false;
								tab.swipeClass = "";
							}
						});
					},150);
				}
				
				// select tab
				ctrl.activeTab = selectedTab;
				// allows the scrollspy to reset
				$rootScope.$broadcast('$locationChangeSuccess'); 
				$document.scrollTop(0);
				
				// update codemirror
				ctrl.isCodeMirror = !ctrl.isCodeMirror;
				
			}
			
			// swipe tabs
			function onSwipe (direction, tab, event) {
				// disable on mouse events
				if (event.pointerType === "mouse") return; 
				// only one tab: abort
				if (this.article.content.length === 1) return; 
				// check if event target is in a table
				var el = event.target;
				while (!el.className || (el.className.indexOf("tab-pane") === -1 && el.tagName !== "TABLE")) {
					el = el.parentNode;
				}
				// no swipe if table is overflowing
				if (el.tagName === "TABLE" && checkOverflow(el)) return;
				// identify new tab, load content
				var idx = this.article.content.indexOf(tab),
						newIdx = (direction === 'left') ? idx+1 : idx-1;
				if (newIdx<0 || newIdx>=this.article.content.length) return;
				return this.select(this.article.content[newIdx]);
			}
			
			// fn used to prevent swiping when scrolling an overflowing element
			function checkOverflow(el) {
				var curOverflow = el.style.overflow;
				if ( !curOverflow || curOverflow === "visible" ) el.style.overflow = "hidden";
				var isOverflowing = el.clientWidth < el.scrollWidth || el.clientHeight < el.scrollHeight;
				el.style.overflow = curOverflow;
				return isOverflowing;
			}
			
			
			// Update existing Article
			function updateFn () {
				// do nothing if article has not changed
				if (angular.equals(this.article,this.articleOld)) {
					return;
				}
				// deep copy to prevent flickering
				this.articleOld = angular.copy(this.article); 
				// save to db
				this.articleOld.$update(
				function() {
					//Notification.success('article successfully updated');
					this.isCodeMirror = !this.isCodeMirror;
				}, 
				function(errorResponse) {
					var error = errorResponse.data.message;
					Notification.error(error);
				});
			}

		}]
	});
	/*
	ngModule.animation('.fromLeft', ['$animateCss', function($animateCss) {
		
		function removeClass(element, className, callback) {
			element.removeClass(className);
			console.log(className);
			if (callback) {
				callback();
			}
		}
		
		return {
			beforeEnter: function(element, doneFn) {
				console.log("in left");
				console.log(element);
				// var removeClassFn = removeClass.bind(this, element, 'fromLeft', doneFn);
				var animator = $animateCss(element, {
					easing: 'ease-out',
					from: { transform: 'translateX(100%)' },
					to: { transform: 'translateX(0)' },
					duration: 0.6 // one second
				});
				animator
					.start()
					.finally(function() {console.log("done in left")}); //.finally(removeClassFn);
				doneFn();
					
			},
			beforeLeave: function(element, doneFn) {
				console.log("out left");
				console.log(element);
				var removeClassFn = removeClass.bind(this, element, 'absoluteTop', doneFn);
				var animator = $animateCss(element, {
					addClass: 'absoluteTop',
					easing: 'ease-out',
					from: { transform: 'translateX(0)' },
					to: { transform: 'translateX(-100%)' },
					duration: 0.6 // one second
				});
				animator
					.start()
					.finally(removeClassFn); //.finally(removeClassFn);
			}
		}
	}]);
	
	ngModule.animation('.fromRight', ['$animateCss', function($animateCss) {
		
		function removeClass(element, className, callback) {
			element.removeClass(className);
			console.log(className);
			if (callback) {
				callback();
			}
		}
		
		return {
			
			enter: function(element, doneFn) {
				console.log("in right");
				var removeClassFn = removeClass.bind(this, element, 'absoluteTop', doneFn);
				var animator = $animateCss(element, {
					addClass: 'absoluteTop',
					easing: 'ease-out',
					from: { transform: 'translateX(-100%)' },
					to: { transform: 'translateX(0)' },
					duration: 0.6 // one second
				});
				animator
					.start()
					.finally(removeClassFn); //.finally(removeClassFn);
				doneFn();
					
			},
			
			leave: function(element, doneFn) {
				console.log("out right");
				console.log(element);
				var removeClassFn = removeClass.bind(this, element, 'absoluteTop', doneFn);
				var animator = $animateCss(element, {
					//addClass: 'absoluteTop',
					easing: 'ease-out',
					from: { transform: 'translateX(0)' },
					to: { transform: 'translateX(100%)' },
					duration: 6 // one second
				});
				animator
					.start()
					.finally(function() {console.log("done out right")}); //.finally(removeClassFn);
				doneFn();
			}
			
		}
	}]);
	*/
	
};
