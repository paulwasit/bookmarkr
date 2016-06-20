'use strict';

module.exports = function (ngModule) {

	//require('./domOps.js'); 
	//require('./assets/scss/custom.scss'); //bundled via globbing
	var getNgram = require('./helpers/getNgram.js'),
			getWords = require('./helpers/getWords.js');
	
	ngModule.directive('pwSmartKeyboard', function(Authentication, $timeout) {
		
		return {
			restrict: 'E',
			template: require('./pw-smart-keyboard.html'),
			scope: {
				freqJson: "="
			},
			link: function(scope, element, attrs) {
				
				// authentication (show/hide 'create new' button)
				scope.user = Authentication.user;
				
				// function fired on click, keyup & button press
				scope.textArea = element.find("textarea"); // jqLite: lookup only by tag, not id nor class
				scope.textArea[0].focus();
				scope.textArea.val("");
				
				scope.onInputEvent = function () {
					scope.cursorPos = scope.textArea[0].selectionStart;
					if (scope.inputText !== scope.textArea.val()) scope.inputText = scope.textArea.val(); // feels hack-ish, but ngKeyup doesn't update the model when spacebar or return are pressed
					scope.ngram = getNgram(scope.inputText, scope.cursorPos);	
					scope.words = getWords(scope.ngram,scope.freqJson); // array of length 3 even when less words
				};
				
				// init
				scope.inputText = "";
				scope.onInputEvent();
				
				scope.updateInput = function (newWord) {
					
					if (scope.ngram.nextText.substring(0,1) !== ' ') {
						scope.cursorPos = scope.ngram.cursorPos;
						newWord = newWord + ' ';
					}
					else {
						scope.cursorPos = scope.ngram.cursorPos + 1;
					}
					
					scope.cursorPos = scope.cursorPos + newWord.length;
					scope.inputText = scope.ngram.previousText + newWord + scope.ngram.nextText;
					
					// timeout is required to let ng-model update the textarea after inputText has changed
					$timeout(function() {
						scope.textArea[0].focus();
						scope.textArea[0].setSelectionRange(scope.cursorPos,scope.cursorPos);
						scope.onInputEvent();
					});
					
				};
				
			}
		};
		
	});

};