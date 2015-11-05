angular.module("umbraco").controller("preview.picker.editor.controller", function($scope) {

	// Initialization Methods ////////////////////////////////////////////////////

	/**
	* @method init
	* @description Triggered on the controller loaded, kicks off any initialization functions.
	*/
	$scope.init = function() {
		$scope.setVariables();
		console.info('config', $scope.model.config);
	};

	$scope.setVariables = function() {

	};

	// Event Handler Methods /////////////////////////////////////////////////////

	// Helper Methods ////////////////////////////////////////////////////////////

	// Call $scope.init() ////////////////////////////////////////////////////////

	$scope.init();

});
