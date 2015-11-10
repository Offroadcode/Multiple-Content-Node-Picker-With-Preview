angular.module("umbraco.resources").factory("imagePreviewResource", function ($http) {

	var imageService = {};

	imageService.getImage = function (nodeId) {
		return $http.get("Backoffice/Image/ImageApi/GetImageUrlById?id=" + nodeId).then(function (response) {
 			return response.data;
		});
	};
	return imageService;
});
