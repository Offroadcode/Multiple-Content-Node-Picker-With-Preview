angular.module("umbraco").controller("doctype.selector.controller", function($scope, docTypeSelectorResource) {

	// Initialization Methods ////////////////////////////////////////////////////

	/**
	* @method init
	* @description Triggered on the controller loaded, kicks off any initialization functions.
	*/
	$scope.init = function() {
		$scope.setVariables();
	};

	/**
	* @method buildDocTypeOptionList
	* @description Gets all doc types via an API call, and builds a list of doctypes. If $scope.model.value matches one, then set that one as selected.
	*/
	$scope.buildDocTypeOptionList = function() {
		docTypeSelectorResource.getAll().then(function(data) {
			if (data && data.length) {
				data.forEach(function(docType) {
					var option =  {
						id: docType.id,
						name: docType.name
					};
					$scope.docTypes.push(option);
					if ($scope.model.value == option.id) {
						$scope.selectedDocType = option;
					}
				});
			}
		});
	};

	/**
	* @method setVariables
	* @description Sets the initial state for the variables.
	*/
	$scope.setVariables = function() {
		$scope.docTypes = [{id: 0, name: "Select DocType"}];
		$scope.selectedDocType = $scope.docTypes[0];
		$scope.buildDocTypeOptionList();
	};

	// Event Handler Methods /////////////////////////////////////////////////////

	/**
	* @method updateValue
	* @description If a doctype option was selected, update the model's value to the ID of that doctype.
	*/
	$scope.updateValue = function() {
		var updatedValue = null;
		if ($scope.selectedDocType.id != 0) {
			updatedValue = $scope.selectedDocType.id;
		}
		$scope.model.value = updatedValue;
	};

	// Call $scope.init() ////////////////////////////////////////////////////////

	$scope.init();

});
