'use strict';

module.exports = function (ngModule) {

	ngModule.directive('pwUserPicture', function($timeout, $window, Authentication, Notification) {
		return {
			restrict: 'AE',
			template: require("./pw-user-picture.html"),
			scope: {
				user: "="
			},
			controller: ['$scope', 'FileUploader', function($scope, FileUploader) {
				// Create file uploader instance
				$scope.uploader = new FileUploader({
					url: 'api/users/picture',
					alias: 'newProfilePicture'
				});
			}], 
			link: function(scope, element, attrs) {
				
				scope.imageURL = scope.user.profileImageURL;

				// Set file uploader image filter
				scope.uploader.filters.push({
					name: 'imageFilter',
					fn: function (item, options) {
						var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
						return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
					}
				});

				// Called after the user selected a new picture file
				scope.uploader.onAfterAddingFile = function (fileItem) {
					if ($window.FileReader) {
						var fileReader = new FileReader();
						fileReader.readAsDataURL(fileItem._file);

						fileReader.onload = function (fileReaderEvent) {
							$timeout(function () {
								scope.imageURL = fileReaderEvent.target.result;
							}, 0);
						};
					}
				};

				// Called after the user has successfully uploaded a new picture
				scope.uploader.onSuccessItem = function (fileItem, response, status, headers) {
					
					// Show success message
					Notification.success("Profile Picture successfully updated");
					
					// Populate user object
					scope.user = Authentication.user = response;

					// Clear upload buttons
					scope.cancelUpload();
				};

				// Called after the user has failed to uploaded a new picture
				scope.uploader.onErrorItem = function (fileItem, response, status, headers) {
					
					// Clear upload buttons
					scope.cancelUpload();

					// Show error message
					Notification.error(response.message);
				};

				// Change user profile picture
				scope.uploadProfilePicture = function () {
					
					// Start upload
					scope.uploader.uploadAll();
				};

				// Cancel the upload process
				scope.cancelUpload = function () {
					scope.uploader.clearQueue();
					scope.imageURL = scope.user.profileImageURL;
				};
				
			}
		};
	});
	
};