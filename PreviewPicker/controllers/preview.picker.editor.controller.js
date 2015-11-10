angular.module("umbraco").controller("preview.picker.editor.controller", function($scope, contentResource, imagePreviewResource) {

	// Initialization Methods ////////////////////////////////////////////////////

	/**
	* @method init
	* @description Triggered on the controller loaded, kicks off any initialization functions.
	*/
	$scope.init = function() {
		$scope.setVariables();
	};

	/**
	* @method buildChildrenList
	* @param {integer} nodeId - The id of the content node to retrieve the children for.
	* @param {string} docTypeAlias - The doctype alias for the children nodes to build the list from.
	* @description Acquire a list of nodes that are children of the indicated content node.
	*/
	$scope.buildChildrenList = function(nodeId, doctypeAlias, callback) {
		if (nodeId) {
			contentResource.getChildren(nodeId).then(function(data) {
				if (data && data.items && data.items.length > 0) {
					data.items.forEach(function(node) {
						var node = new previewPicker.Models.PreviewNode({
							contentTypeAlias: node.contentTypeAlias,
							id: node.id,
							name: node.name,
							properties: node.properties
						});
						if (node.contentTypeAlias === doctypeAlias) {
							$scope.children.push(node);
						}
					});
				}
				$scope.children = $scope.filterAndSortNodeProperties($scope.children, $scope.config.properties);
				if (callback) {
					callback($scope.children);
				}
			});
		}
	};

	/**
	* @method updateList
	* @param {array of previewPicker.Models.PickerNode} children
	* @description Update the selected list with any new data from the connected nodes.
	*/
	$scope.updateList = function(children) {
		if (children && children.length > 0) {
			if ($scope.list && $scope.list.length > 0) {
				var updatedList = [];
				$scope.list.forEach(function(listItem) {
					children.forEach(function(child) {
						if (child.id == listItem.id) {
							listItem.properties = child.properties;
							updatedList.push(new previewPicker.Models.PreviewNode(listItem));
						}
					});
				});
				$scope.list = updatedList;
				$scope.model.value.list = $scope.list;
				for (var i = 0; i < $scope.list.length; i++) {
					$scope.addThumbnailToNode(i);
				}
			}
		}
	};

	/**
	* @method setVariables
	* @description Sets the initial state for the $scope variables for the controller.
	*/
	$scope.setVariables = function() {
		$scope.config = new previewPicker.Models.PreviewConfig($scope.model.config);
		if ($scope.config && $scope.config.startNode !== 0) {
			$scope.children = [new previewPicker.Models.PreviewNode({contentTypeAlias: '', id: 0, name: 'Choose Node', properties: []})];
			$scope.isChildSelectorOpen = false;
			$scope.list = $scope.getCurrentList();
			for (var i = 0; i < $scope.list.length; i++) {
				$scope.addThumbnailToNode(i);
			}
			$scope.selectedChild = new previewPicker.Models.PreviewNode({contentTypeAlias: '', id: 0, name: 'Choose Node', properties: []});
			$scope.buildChildrenList($scope.config.startNode, $scope.config.doctype, function(children) {
				$scope.updateList(children);
			});
		}
	};

	// Event Handler Methods /////////////////////////////////////////////////////

	/**
	* @method addNodeToList
	* @description Add $scope.selectedChild (from dropdown in view) to $scope.model.value.list.
	*/
	$scope.addNodeToList = function() {
		if ($scope.selectedChild.id !== 0) {
			$scope.list.push(new previewPicker.Models.PreviewNode($scope.selectedChild));
			$scope.model.value = {list: $scope.list};
			$scope.addThumbnailToNode($scope.model.value.list.length - 1);
			$scope.toggleChildSelector();
			$scope.selectedChild = new previewPicker.Models.PreviewNode({contentTypeAlias: '', id: 0, name: 'Choose Node', properties: []});
		}
	};

	/**
	* @method deleteItem
	* @param {integer} index - The index (zero-based) of the item to delete from the question array.
	* @description Deletes an item from the list of previews
	*/
	$scope.deleteItem = function(index) {
		$scope.model.value.list.splice(index, 1);
		$scope.list = $scope.model.value.list;
	};

	/**
	* @method editItem
	* @param {integer} index - The index (zero-based) of the item.
	* @description Navigate the user to the node of the selected item for editing purposes.
	*/
	$scope.editItem = function(index) {
		var node = $scope.model.value.list[index];
		var url = "/umbraco/#/content/content/edit/" + node.id;
		window.location = url;
	}

	/**
	* @method sortItem
	* @param {integer} index - The index of the item to be shifted.
	* @param {integer} change - The amount of positions to shift the item by.
	* @description Sorts an item into a new position in $scope.model.value.list.
	*/
	$scope.sortItem = function(index, change) {
		$scope.model.value.list.splice((index + change), 0, $scope.model.value.list.splice(index, 1)[0]);
		$scope.list = $scope.model.value.list;
	};

	/**
	* @method toggleChildSelector
	* @description Toggles the visibility of the child selector field.
	*/
	$scope.toggleChildSelector = function() {
		$scope.isChildSelectorOpen = !$scope.isChildSelectorOpen;
	};

	// Helper Methods ////////////////////////////////////////////////////////////

	/**
	* @method addThumbnailToNode
	* @param {integer} index
	* @description Gets the node ID of the associated thumbnail property, then via API get the associated URL and assign it.
	*/
	$scope.addThumbnailToNode = function(index) {
		var node = new previewPicker.Models.PreviewNode($scope.list[index]);
		var thumbnailAlias = $scope.config.image;
		if (node.properties && node.properties.length > 0) {
			node.properties.forEach(function(property) {
				if (property.alias == thumbnailAlias) {
					imagePreviewResource.getImage(property.value).then(function(url) {
						$scope.model.value.list[index].thumbnail = url.split('"')[1];
						$scope.list = $scope.model.value.list;
					})
				}
			});
		}
	};

	/**
	* @method filteredChildren
	* @returns {array of previewPicker.Models.PreviewNode}
	* @description Loops through $scope.children and extracts any that are already part of $scope.list, retrurning the filtered list.
	*/
	$scope.filteredChildren = function() {
		var children = $scope.children.map(function(child) {
			return new previewPicker.Models.PreviewNode(child);
		});
		var filteredChildren = [];
		children.forEach(function(child) {
			var isAlreadyOnList = false;
			$scope.list.forEach(function(listItem) {
				if (listItem.id == child.id) {
					isAlreadyOnList = true;
				}
			});
			if (!isAlreadyOnList) {
				filteredChildren.push(child);
			}
		});
		return filteredChildren;
	};

	/**
	* @method filterAndSortNodeProperties
	* @param {array of previewPicker.Models.PreviewNode} list - The list of nodes to filter
	* @param {array of string} propertyAliases - The aliases of the properties that are to remain after being filtered.
	* @returns {array of previewPickerModels.PreviewNode}
	* @description Sort out all unneeded properties from the nodes in the list that don't match the provided aliases, or the image thumbnail.
	*/
	$scope.filterAndSortNodeProperties = function(list, propertyAliases) {
		var propertyFilteredList = [];
		if (list && list.length > 0) {
			list.forEach(function(item) {
				var filteredProperties = [];
				if (item.properties && item.properties.length) {
					item.properties.forEach(function(property) {
						var shouldIncludeProperty = false;
						if (propertyAliases && propertyAliases.length > 0) {
							propertyAliases.forEach(function(propAlias) {
								if (propAlias.toLowerCase() === property.alias.toLowerCase()) {
									shouldIncludeProperty = true;
								}
							});
						}
						if (property.alias.toLowerCase() === $scope.config.image.toLowerCase()) {
							shouldIncludeProperty = true;
						}
						if (shouldIncludeProperty) {
							filteredProperties.push(new previewPicker.Models.PreviewProperty(property));
						}
					});
				}
				propertyFilteredList.push(new previewPicker.Models.PreviewNode({
					contentTypeAlias: item.contentTypeAlias,
					id: item.id,
					name: item.name,
					properties: filteredProperties,
					published: item.pusblished
				}));
			});
		}
		return propertyFilteredList;
	};

	/**
	* @method getCurrentList
	* @returns {array of previewPicker.Models.PreviewNode}
	* @description Returns all nodes in $scope.model.value.list.
	*/
	$scope.getCurrentList = function() {
		var list = [];
		if ($scope.model.value.list && $scope.model.value.list.length > 0) {
			list = $scope.model.value.list.map(function(child) {
				return new previewPicker.Models.PreviewNode(child);
			});
		}
		return list;
	};

	/**
	* @method isAtMax
	* @returns {bool}
	* @description If the $scope.model.value.list already has the maximum number of items, return true. Otherwise, return false.
	*/
	$scope.isAtMax = function() {
		var isAtMax = false;
		if ($scope.config.maximum > 0) {
			if ($scope.model.value.list && $scope.model.value.list.length > 0) {
				if ($scope.model.value.list.length > $scope.config.maximum) {
					isAtMax = true;
				}
			}
		}
		return isAtMax;
	};

	// Call $scope.init() ////////////////////////////////////////////////////////

	$scope.init();

});
