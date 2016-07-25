'use strict';

module.exports = function (ngModule) {

	require('~/_misc/pw-ui-sref-if')(ngModule); 	          // disable click on tab headings on edit mode
	require('~/_misc/pw-click-outside')(ngModule);    // hide the toc when clicking outside on small screens
	var modalConfirmTemplate = require('~/_misc/pw-modal-confirm'); // confirm tab suppression
	var modalTemplate = require('~/_misc/pw-modal-template');

	ngModule.component('pwArvAside', {
		template: require('./pw-arv-aside.html'),
		bindings: {
			article: "="
		},
		require: {
			pwArticleView: '^^'
		},
		controller: ['$uibModal', function ($uibModal) {
		
			// exposed functions
			this.closeThis = closeThis; 			 // collapse aside when clicking outside it
			this.createNewTab = createNewTab;  // display creation modal
			this.renameTab = renameTab;			   // display renaming modal
			this.deleteTab = deleteTab;			   // display deletion confirmation modal
			
			
			////////////
			
			
			// action on click-outside
			function closeThis () { this.pwArticleView.toggleAsideCollapsed(true); };
				
			// add a new tab
			function createNewTab () {
				var _this = this,
					  modalInstance = $uibModal.open( modalTemplate("Page Title", "New Page") );
				modalInstance.result.then(function (newTitle) {
					_this.article.content.push({title: newTitle, body: '#### New_Title\r\n\r\nNew_content'});
					_this.pwArticleView.select(_this.article.content[_this.article.content.length-1]);
				}, function () {});	
				
			}
			
			// Rename Tab
			function renameTab (tab) {
				var idx = this.article.content.indexOf(tab);
				if (idx === -1) return;
				var modalInstance = $uibModal.open(modalTemplate("Page Title", tab.title));
				modalInstance.result.then(function (newTitle) {
					tab.title = newTitle;
				}, function () {});
			}
			
			// delete a tab
			function deleteTab (tab) {
				var _this = this,
						modalInstance = $uibModal.open( modalConfirmTemplate("Confirm suppression?") );
				modalInstance.result.then(function () {
					var idx = _this.article.content.indexOf(tab);
					if (idx === -1) return;
					_this.article.content.splice(idx, 1);
					if (tab.active) {
						if (idx === _this.article.content.length) idx=idx-1;
						_this.pwArticleView.select(_this.article.content[idx]);
					}
				}, function () {});	
			}
			
		}]
	});
};
