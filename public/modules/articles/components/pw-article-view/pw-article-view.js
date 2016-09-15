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
		controller: ['$rootScope', '$scope', '$state', '$document', '$interval', '$timeout', 'Authentication', 'Articles', 'Notification',
		function ($rootScope, $scope, $state, $document, $interval, $timeout, Authentication, Articles, Notification) {
			
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
				this.activeTab.swipeClass = "activeTab";
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
				isCalledFromInside = (typeof isCalledFromInside === 'undefined') ? false : isCalledFromInside;
				if (isCalledFromInside) {
					angular.forEach(this.article.content, function(tab) {
						if (tab === selectedTab) {
							tab.active = true;
							tab.swipeClass = "activeTab";							
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
							tab.swipeClass = "inactiveTab " + swipeDirection;
							ctrl.activeTab = tab;
						}
						else if (tab === selectedTab) {
							tab.swipeClass = "activeTab " + swipeDirection;
							tab.active = true;
						}
						else {
							tab.active = false;
							tab.swipeClass = "";
						}
					});
			
					var result = document.getElementsByClassName("activeTab");
					onetime(result[0], "animationend", animateHandler);
					
				}
				
				// select tab
				ctrl.activeTab = selectedTab;
				
				// allows the scrollspy to reset
				$rootScope.$broadcast('$locationChangeSuccess'); 
				$document.scrollTop(0);
				
				// update codemirror
				ctrl.isCodeMirror = !ctrl.isCodeMirror;
				
			}
			
			// create a one-time event
			function onetime(node, type, callback) {

				// create event
				node.addEventListener(type, function(e) {
					// remove event
					e.target.removeEventListener(e.type, arguments.callee);
					// call handler
					return callback(e);
				});

			}
			
			// handler function
			function animateHandler(e) {
				angular.forEach(ctrl.article.content, function(tab) {
					
					if (tab.swipeClass.indexOf("inactiveTab") !== -1) {
						tab.active = false;
						tab.swipeClass = "";
					}
					else if (tab.swipeClass.indexOf("activeTab") !== -1)  {
						tab.swipeClass = "activeTab";
					}
					
				});
				$scope.$apply();
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
	
};
