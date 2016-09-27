'use strict';

module.exports = function (ngModule) {

	var getNgram = require('./helpers/getNgram.js'),
			getWords = require('./helpers/getWords.js');
	
	ngModule.component('pwSmartKeyboard', {
		template: require('./pw-smart-keyboard.html'),
		bindings: {
			jsonData: '='
		},
		controller: ['$timeout', function ($timeout) {
			
			var ctrl = this;
			
			// exposed functions
			this.onInputEvent = onInputEvent;
			this.updateInput = updateInput;
		

			// initialize exposed variables
			this.$onInit = function () {
				
				// debugger
				this.check="";
				
				// function fired on click, keyup & button press
				this.textArea = angular.element(document.getElementById('inputText'));
				//this.textArea[0].focus();
				this.textArea.val("");
				
				// init
				this.inputText = "";
				this.onInputEvent();
				
			};
			
			// functions declaration
			function onInputEvent (eventType) {
				ctrl.check += eventType + " - ";
				ctrl.cursorPos = ctrl.textArea[0].selectionStart;
				// feels hack-ish, but ngKeyup doesn't update the model when spacebar or return are pressed
				if (ctrl.inputText !== ctrl.textArea.val()) ctrl.inputText = ctrl.textArea.val(); 
				ctrl.ngram = getNgram(ctrl.inputText, ctrl.cursorPos);	
				// array of length 3 even when less words
				ctrl.words = getWords(ctrl.ngram,ctrl.jsonData);
			}
			
			function updateInput (newWord) {
				ctrl.check += "here ";
				if (ctrl.ngram.nextText.substring(0,1) !== ' ') {
					ctrl.cursorPos = ctrl.ngram.cursorPos;
					newWord = newWord + ' ';
				}
				else {
					ctrl.cursorPos = ctrl.ngram.cursorPos + 1;
				}
				
				ctrl.cursorPos = ctrl.cursorPos + newWord.length;
				ctrl.inputText = ctrl.ngram.previousText + newWord + ctrl.ngram.nextText;
				
				// timeout is required to let ng-model update the textarea after inputText has changed
				$timeout(function() {
					ctrl.textArea[0].focus();
					ctrl.textArea[0].setSelectionRange(ctrl.cursorPos,ctrl.cursorPos);
					ctrl.onInputEvent('button');
				});
				
			}

		}]
		
	})
	
	.directive('pwInputstart', ['$parse', function($parse) {
		return function(scope, element, attr) {
			var clickHandler = $parse(attr.pwInputstart);
			element.on('mousedown touchstart', function(event) {
				scope.$apply(function() {
					clickHandler(scope, {$event: event});
				});
			});
		};
	}])
	
	.directive('pwInputend', ['$parse', function($parse) {
		return function(scope, element, attr) {
			var clickHandler = $parse(attr.pwInputend);
			element.on('mouseup touchend', function(event) {
				scope.$apply(function() {
					clickHandler(scope, {$event: event});
				});
			});
		};
	}]);

};