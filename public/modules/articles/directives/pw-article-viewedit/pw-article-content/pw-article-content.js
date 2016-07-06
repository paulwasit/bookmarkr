'use strict';

module.exports = function (ngModule) {
	
	require('../../../assets/highlightjs/styles/github.css'); // display code snippets on markdown
	require('../../../../_misc/pw-focus-me')(ngModule);	     // refesh CodeMirror automatically when saving on edit mode
	
	var modalTemplate = require('../../../../_misc/pw-modal-template');
	
	ngModule.directive('pwArticleContent', function($uibModal) {
		return {
			restrict: 'EA',
			template: require('./pw-article-content.html'),
			scope: false,
			link: function(scope, element, attrs) {
				
				// codemirror options
				scope.editorOptions = {
					scrollbarStyle: "null",
					indentUnit: 4,
					lineWrapping : true,
					lineNumbers: false,
					readOnly: false, //'nocursor'
					mode: 'markdown',
					viewportMargin: Infinity
				};
				
				// Rename Article Title
				scope.renameTitle = function () {
					var modalInstance = $uibModal.open(modalTemplate("Article Title", scope.article.title));
					modalInstance.result.then(function (newTitle) {
						scope.article.title = newTitle;
					}, function () {});

				};	
				
				// swipe tabs
				scope.onSwipe = function (direction, tab, event) {
					if (event.pointerType === "mouse") return; // disable on mouse events
					var idx = scope.article.content.indexOf(tab),
							newIdx = (direction === 'left') ? idx+1 : idx-1;
					if (newIdx<0 || newIdx>=scope.article.content.length) return;
					return scope.select(scope.article.content[newIdx]);
				};
				/*
				targetElement.addEventListener("pointerdown", function(ev) {
					// Call the appropriate pointer type handler
					switch (ev.pointerType) {
						case "mouse": 
							process_pointer_mouse(ev); 
							break;
						case "pen": 
							process_pointer_pen(ev); 
							break;
						case "touch": 
							process_pointer_touch(ev); 
							break;
						default:
							console.log("pointerType " + ev.pointerType + " is Not suported");
					}
				}, false);
				*/
			}
		};
	});
	
};

