'use strict';

module.exports = function (ngModule) {

	require('~/_misc/pw-in-header')(ngModule);	
	
	ngModule.component('pwArvButtons', {
		template: require('./pw-arv-buttons.html'),
		bindings: {
			article: '='
		},
		require: {
			pwArticleView: '^^'
		},
		controller: ['Items', '$window', '$timeout', 'Notification', 'FileUploader',
		function (Items, $window, $timeout, Notification, FileUploader) {
			
			var ctrl = this;
			
			// exposed functions
			this.togglePublic = togglePublic;  // update value & save article
			this.toggleSlide  = toggleSlide;   // update value & save article
			this.cancelUpload = cancelUpload;
			
			// exposed values 
			this.$onInit = function () {
				// prepare img uploader
				this.uploader = new FileUploader({
					url: 'api/articles/getSignedUrl',
					alias: 'newImg'
				});
			};
			
			this.$postLink = function ()	{
				this.uploader.filters.push({
					name: 'imageFilter',
					fn: function (item, options) {
						var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
						if ('|jpg|png|jpeg|bmp|gif|'.indexOf(type) === -1) ctrl.cancelUpload();
						return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
					}
				});
				this.uploader.onAfterAddingFile = onAfterAddingFile;
				this.uploader.onSuccessItem = onSuccessItem;
				this.uploader.onErrorItem = onErrorItem;
			};
			
			
			////////////
			
			
			// Make an Article Public / Private
			function togglePublic () {
				this.article.isPublic = !this.article.isPublic;
				this.pwArticleView.updateFn();
			}
			
			// Make an Article Slide / Full
			function toggleSlide () {
				this.article.isSlide = !this.article.isSlide;
				this.pwArticleView.updateFn();
			}

			// Called after the user selected a new picture file
			function onAfterAddingFile (fileItem) {
				fileItem.url = fileItem.url + "?file-type=" + fileItem._file.type;				
				ctrl.uploader.uploadItem(fileItem);
			}
			
			function onSuccessItem (fileItem, response, status, headers) {
				var file = fileItem._file;
				const xhr = new XMLHttpRequest();
				xhr.file = file;
				xhr.onreadystatechange = () => {
					if(xhr.readyState === 4){
						if(xhr.status === 200){
							console.log(response.url);
							// show link
							window.prompt("Copy to clipboard: Ctrl+C, Enter", response.url);
							// Show success message
							Notification.success("Image successfully updated");
						}
						else{
							// Show error message
							Notification.error(xhr.responseText);
						}
					}
				};
				xhr.open('PUT', response.signedRequest, true);
				xhr.send(file);
				// Clear upload buttons
				ctrl.cancelUpload();
			}
			
			// Error on getSignedUrl
			function onErrorItem (fileItem, response, status, headers) {
				// Clear upload buttons
				ctrl.cancelUpload();
				// Show error message
				Notification.error(response.message);
			}
			
			// Cancel the upload process
			function cancelUpload () {
				ctrl.uploader.clearQueue();
			}
			
		}]
	});
};
	