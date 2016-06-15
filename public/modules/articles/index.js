'use strict'

module.exports = function (appModule) {

	// dependencies maybe
	window.CodeMirror = require('codemirror'); // codemirror editor
	require('codemirror/mode/markdown/markdown');
	require('codemirror/lib/codemirror.css');
	//require('sortablejs/Sortable');
	
	var	marked = require('marked');         // markdown text editor
	
	// module name
	var moduleName = 'articles';
	
	// module init
	angular.module(moduleName,
		[
			require('sortablejs/ng-sortable'), // makes lists sortable
			require('angular-scroll'), // angular scroll/scrollPage with anchors
			require('angular-marked'), // angular directive wrapper for marked
			require('./helpers/angular-marked-toc'),
			require('./assets/ui-codemirror/ui-codemirror')
		]
	);
	appModule.requires.push(moduleName);
	var ngModule = angular.module(moduleName);
	
	// modules elements
	require('./config')(ngModule);
	require('./menus')(ngModule);
	require('./routes')(ngModule);
	require('./rest')(ngModule);
	require('.//directives/pw-article-list/pw-article-list')(ngModule);
	require('.//directives/pw-article-viewedit/pw-article-viewedit')(ngModule);
	
};

// webpack hot reload
if (module.hot) {
  module.hot.accept();
  module.hot.dispose(function() {});
}