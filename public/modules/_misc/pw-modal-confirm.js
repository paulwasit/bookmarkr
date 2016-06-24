'use strict';

// exports
module.exports = function (modalTitle) {
	return {
		animation: false,
		template: 
			'<div class="modal-body">' +
				'<div class="form-group">' +
					'<label>' + modalTitle + ':</label>' +
				'</div>' +
			'</div>' +
			'<div class="modal-footer">' +
				'<button class="btn btn-primary" type="button" ng-click="ok()">OK</button>' +
				'<button class="btn btn-warning" type="button" ng-click="cancel()">Cancel</button>' +
			'</div>',
		controller: ['$scope','$uibModalInstance',function ($scope, $uibModalInstance) {
			$scope.ok = function () {
				$uibModalInstance.close();
			};
			$scope.cancel = function () {
				$uibModalInstance.dismiss('cancel');
			};
		}],
		size: 'sm'
	};
};