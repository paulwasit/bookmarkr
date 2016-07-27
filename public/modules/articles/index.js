'use strict'

module.exports = function (appModule) {

	// dependencies (hljs & katex are loaded directly as script tags via config/assets/default)
	window.CodeMirror = require('codemirror'); // codemirror editor
	require('codemirror/mode/markdown/markdown');
	require('codemirror/lib/codemirror.css');
	require('./helpers/highlightjs/styles/github.css'); // display code snippets on markdown
	
	// module name
	var moduleName = 'articles';
	
	// module init
	angular.module(moduleName,
		[
			require('sortablejs/ng-sortable'), // makes lists sortable - see https://github.com/RubaXa/Sortable
			require('angular-scroll'), 				 // angular scroll/scrollPage with anchors
			require('./helpers/angular-marked'),
			require('./helpers/angular-marked-toc'),
			require('./helpers/ui-codemirror')
		]
	);
	appModule.requires.push(moduleName);
	var ngModule = angular.module(moduleName);
	
	// modules elements
	var Items = require('./items.service')(ngModule);	
	require('./config')(ngModule);
	require('./rest')(ngModule);
	require('./menus')(ngModule);
	require('./routes')(ngModule);
	require('./directives/pw-article-lists/pw-article-list')(ngModule);
	require('./directives/pw-article-view/pw-article-view')(ngModule);
	
};

// webpack hot reload
if (module.hot) {
  module.hot.accept();
  module.hot.dispose(function() {});
}