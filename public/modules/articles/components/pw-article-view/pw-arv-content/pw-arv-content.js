'use strict';

module.exports = function (ngModule) {
	
	require('~/_misc/pw-focus-me')(ngModule);	     			// refesh CodeMirror automatically when saving on edit mode
	var modalTemplate = require('~/_misc/pw-modal-template');
	
	ngModule.component('pwArvContent', {
		template: require('./pw-arv-content.html'),
		bindings: {
			article: "=",
			activeTab: "="
		},
		require: {
			pwArticleView: '^^'
		},
		controller: ['$uibModal', function ($uibModal) {
			
			// initialize exposed variables
			this.$onInit = function () {
				this.codemirrorOptions = codemirrorOptions;
			};
			
			// exposed functions
			this.renameTitle  = renameTitle;	 // display renaming modal
			this.renameImgUrl = renameImgUrl;  // display renaming modal
			
			
			////////////
			
			
			var codemirrorOptions = {
				scrollbarStyle: "null",
				indentUnit: 4,
				lineWrapping : true,
				lineNumbers: false,
				readOnly: false, //'nocursor'
				mode: 'markdown',
				viewportMargin: Infinity
			};
			
			// Rename Article Title
			function renameTitle () {
				var article = this.article,
					  modalInstance = $uibModal.open(modalTemplate("Article Title", article.title));
				modalInstance.result.then(function (newTitle) {
					article.title = newTitle;
				}, function () {});
			}
			
			// Rename Article Img Url
			function renameImgUrl () {
				var article = this.article,
						modalInstance = $uibModal.open(modalTemplate("Article Image Url", article.imgUrl));
				modalInstance.result.then(function (newImgUrl) {
					article.imgUrl = newImgUrl;
				}, function () {});
			}		
			
		}]
	});
};

