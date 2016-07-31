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
			article: '='
		},
		controller: ['$rootScope', '$document', '$interval', 'Authentication', 'Articles', 'Notification',
		function ($rootScope, $document, $interval, Authentication, Articles, Notification) {
			
			// initialize exposed variables
			this.$onInit = function () {
				
				// articleOld saves the previous value of the article when running the interval save fn;
				// if no change, the server update fn is not called (limits calls to server)
				this.articleOld = false;
			
				// timer for periodic updates
				this.Timer = null;
			
				// only the article author can modify it
				this.isAuthor = Authentication.user._id === this.article.user._id;
				
				// set the first tab as active
				this.activeTab = this.article.content[0];
				this.article.content[0].active = true;
				
				// toggleable values
				this.isAsideCollapsed = true;
				this.isEditMode = false;
				this.isFullScreen = false;
				this.isCodeMirror = true; // trigger codemirror refresh
				
				// params for reorganizing tabs position
				this.sortableConfig = sortableConfig;
				
			};
			
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
				this.isFullScreen = !this.isFullScreen; 
				// edge
				/*
				if (!document.fullscreenElement) {
						document.documentElement.requestFullscreen();
				} else {
					if (document.exitFullscreen) {
						document.exitFullscreen(); 
					}
				}
				*/
				// chrome, opera, safari
				if (!document.webkitFullscreenElement) {
					document.documentElement.webkitRequestFullscreen();
				} else {
					if (document.webkitExitFullscreen) {
						document.webkitExitFullscreen(); 
					}
				}
				// firefox
				/*
				if (!document.mozFullScreenElement) {
					document.documentElement.mozRequestFullScreen();
				} else {
					if (document.mozCancelFullScreen) {
						document.mozCancelFullScreen(); 
					}
				}
				*/
			}
			
			
			// tab position in the tabs array: first, empty or last
			function tabPosition (tab) {
				var idx = this.article.content.indexOf(tab);
				return (idx === 0) ? 'first' : 
							 (idx === this.article.content.length - 1) ? 'last' : undefined;
			}
			
			
			// tabs selection
			function selectTab (selectedTab, isCalledFromInside) {
				// close the toc
				this.isAsideCollapsed = true; 
				// unselect all tabs but the selected one
				angular.forEach(this.article.content, function(tab) {
					tab.active = (tab === selectedTab) ? true : false;
				});
				// select tab
				this.activeTab = selectedTab;
				// allows the scrollspy to reset
				$rootScope.$broadcast('$locationChangeSuccess'); 
				// scroll to top when click on tab title
				isCalledFromInside = (typeof isCalledFromInside === 'undefined') ? false : true;
				if (!isCalledFromInside && !this.acticle.isSlide) { 
					$document.scrollTop(450);
					$document.scrollTop(0, 300); 
					//$document.scrollTop(0); 
				} 
				// update codemirror
				this.isCodeMirror = !this.isCodeMirror;
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

