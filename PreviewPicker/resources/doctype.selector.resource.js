angular.module("umbraco.resources").factory("docTypeSelectorResource", function ($http) {

	var docTypeService = {};

	docTypeService.getAll = function () {
		return $http.get("Backoffice/DocTypeSelector/DocTypeSelectorApi/GetAllDocTypes").then(function (response) {
 			return response.data;
		});
	};

	docTypeService.getPropertiesForDocType = function (id) {
    	return $http.get("Backoffice/DocTypeSelector/DocTypeSelectorApi/GetPropertiesForDocType?id=" + id).then(function(response) {
        	return response.data;
      	});
    };

	return docTypeService;
});
