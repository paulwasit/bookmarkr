'use strict'

module.exports = function (ngModule) {
	
	// scrollSpy params - https://github.com/oblador/angular-scroll
	ngModule.value('duScrollSpyWait', 0); // debounce timer
	ngModule.value('duScrollBottomSpy', true); // make the last du-scrollspy link active when scroll reaches page/container bottom:
	ngModule.value('duScrollActiveClass', 'custom-class'); // class when link is active
	ngModule.value('duScrollOffset', 80);
	ngModule.value('duScrollGreedy', true);
	
	ngModule.config(function(markedProvider, marked_tocProvider) {
		
		var mdOptions = {
			sanitize: false,
			gfm: true,
			tables: true,
			highlight: function (code, lang) {
				if (lang) {
					return hljs.highlight(lang, code, true).value;
				} 
				else {
					return hljs.highlightAuto(code).value;
				}
			}
		};
		
		// marked md editor customization
		markedProvider.setOptions(mdOptions);
		marked_tocProvider.setOptions(mdOptions);
		
	});
	
	ngModule.run(function($rootScope) {
    $rootScope.$on('duScrollspy:becameActive', function($event, $element, $target){
			$element.parent().addClass('custom-class');
    });
		$rootScope.$on('duScrollspy:becameInactive', function($event, $element, $target){
			$element.parent().removeClass('custom-class');
    });
	});
	
};