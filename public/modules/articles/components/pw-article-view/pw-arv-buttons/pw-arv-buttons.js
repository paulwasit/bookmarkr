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
			
			// exposed values 
			this.$onInit = function () {
				// remember the article list filters that were active when the user clicked the article link
				this.listQuery = Items.getListQuery();
				// prepare img uploader
				this.uploader = new FileUploader({
					url: 'api/articles/loadImg',
					alias: 'newImg'
				});
			};
			
			
			this.$postLink = function ()	{
				this.uploader.filters.push({
					name: 'imageFilter',
					fn: function (item, options) {
						var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
						return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
					}
				});
				this.uploader.onAfterAddingFile = onAfterAddingFile;
				this.uploader.onSuccessItem = onSuccessItem;
				this.uploader.onErrorItem = onErrorItem;
			};
			
			// exposed functions
			this.togglePublic = togglePublic;  // update value & save article
			this.toggleSlide  = toggleSlide;   // update value & save article
			this.uploadImg = uploadImg;
			this.cancelUpload = cancelUpload;
			
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
				/*
				if ($window.FileReader) {
					var fileReader = new FileReader();
					fileReader.readAsDataURL(fileItem._file);
					fileReader.onload = function (fileReaderEvent) {
						$timeout(function () {
							ctrl.imageURL = fileReaderEvent.target.result;
							console.log(ctrl.imageURL);
						}, 0);
					};
					
				}
				*/
				ctrl.uploadImg();
			};

			// Called after the user has successfully uploaded a new picture
			function onSuccessItem (fileItem, response, status, headers) {
				// copy path to clipboard
				this.imageUrl = "![" + fileItem.file.name + "](" + response.path.replace("./public/modules/","./modules/") + ")"
				console.log(this.imageUrl);
				// Clear upload buttons
				ctrl.cancelUpload();
				// Show success message
				Notification.success("Image successfully updated");
			}

			// Called after the user has failed to uploaded a new picture
			function onErrorItem (fileItem, response, status, headers) {
				// Clear upload buttons
				ctrl.cancelUpload();
				// Show error message
				Notification.error(response.message);
			}

			// Ipload img
			function uploadImg () {
				console.log("upload");
				ctrl.uploader.uploadAll();
			};

			// Cancel the upload process
			function cancelUpload () {
				console.log("cancel");
				ctrl.uploader.clearQueue();
			};
		
		}]
	});
};
	