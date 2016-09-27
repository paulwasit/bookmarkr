'use strict';

module.exports = function (ngModule) {

	var getNgram = require('./helpers/getNgram.js'),
			getWords = require('./helpers/getWords.js');
	
	ngModule.component('pwSmartKeyboard', {
		template: require('./pw-smart-keyboard.html'),
		bindings: {
			jsonData: '='
		},
		controller: ['$timeout', '$scope', function ($timeout, $scope) {
			
			var ctrl = this;
			
			// exposed functions
			this.onInputEvent = onInputEvent;
			this.updateInput = updateInput;
		

			// initialize exposed variables
			this.$onInit = function () {
				
				// debugger
				this.check="";
				this.check2="";
				this.inProg = false;
				
				// os
				this.os = getMobileOperatingSystem();
				
				// function fired on click, keyup & button press
				this.textArea = angular.element(document.getElementById('inputText'));
				//this.textArea[0].focus();
				this.textArea.val("");
				
				// init
				this.inputText = "";
				this.onInputEvent();
				
			};
			
			/* ---------- */
			
			// functions declaration
			function onInputEvent (eventType) {
				
				var updateValue;
				ctrl.check += eventType + "/ ";
				
				// inProg prevents flicker of suggested words update on android after pressing the internal keyboard buttons 
				// (word + space on change, then space removal with keyup, then readdition of space with keyup)
				if (ctrl.inProg) return;
				ctrl.check += "ok/ ";
				ctrl.check += ctrl.cursorPos + "-" + ctrl.textArea[0].selectionStart + "/ ";
				
				// action when words update using the internal keyboard (Windows Phone, iOS & Android only)
				if (eventType === "change" && ctrl.cursorPos < ctrl.textArea[0].selectionStart && ctrl.os !== "unknown") {
					ctrl.check += "fck/ ";
					updateValue = ctrl.textArea.val() + " ";
					updatePos = ctrl.textArea[0].selectionStart + 1;
					/*
					if (ctrl.os === "iOS") {
						ctrl.textArea.val(updateValue);
						ctrl.cursorPos = updatePos;
					}
					else {
						*/
						ctrl.inProg = true;
						ctrl.cursorPos = ctrl.textArea[0].selectionStart;
						$timeout(function() {
							ctrl.inProg = false;
						},100);
					//}
				}
				else {
					updateValue = ctrl.textArea.val();
					updatePos = ctrl.textArea[0].selectionStart;
					ctrl.cursorPos = ctrl.textArea[0].selectionStart;
				}
				
				// feels hack-ish, but ngKeyup doesn't update the model when spacebar or return are pressed - also accounts for button presses
				if (ctrl.inputText !== ctrl.textArea.val()) ctrl.inputText = ctrl.textArea.val(); 
				
				ctrl.textArea[0].focus();
				//ctrl.check += '"' + updateValue + updatePos + '"';
				// current last words
				ctrl.ngram = getNgram(updateValue, updatePos);	
				// array of length 3 even when less words
				ctrl.words = getWords(ctrl.ngram,ctrl.jsonData);
			}
			
			function updateInput (newWord) {
				if (ctrl.ngram.nextText.substring(0,1) !== ' ') {
					ctrl.cursorPos = ctrl.ngram.cursorPos;
					newWord = newWord + ' ';
				}
				else {
					ctrl.cursorPos = ctrl.ngram.cursorPos + 1;
				}
				
				ctrl.cursorPos = ctrl.cursorPos + newWord.length;
				// ctrl.inputText = ctrl.ngram.previousText + newWord + ctrl.ngram.nextText;
				ctrl.textArea.val(ctrl.ngram.previousText + newWord + ctrl.ngram.nextText);

				// timeout is required to let ng-model update the textarea after inputText has changed
				//$timeout(function() {
					ctrl.textArea[0].focus();
					ctrl.textArea[0].setSelectionRange(ctrl.cursorPos,ctrl.cursorPos);
					ctrl.onInputEvent('button');
				//});
				
			}
			
			function getMobileOperatingSystem() {
				var userAgent = navigator.userAgent || navigator.vendor || window.opera;
				// Windows Phone must come first because its UA also contains "Android"
				if (/windows phone/i.test(userAgent)) return "Windows Phone";
				if (/android/i.test(userAgent)) return "Android";
				// iOS detection from: http://stackoverflow.com/a/9039885/177710
				if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) return "iOS";
				return "unknown"
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