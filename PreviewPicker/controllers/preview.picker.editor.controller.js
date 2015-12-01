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
	* @method setVariables
	* @description Sets the initial state for the $scope variables for the controller.
	*/
	$scope.setVariables = function() {
		$scope.config = new previewPicker.Models.PreviewConfig($scope.model.config);
		$scope.isChildSelectorOpen = false;
		if ($scope.config && $scope.config.startNode !== 0) {
			$scope.children = [new previewPicker.Models.PreviewNode({contentTypeAlias: '', id: 0, name: 'Choose Node', properties: []})];
			$scope.list = [];
			$scope.selectedChild = new previewPicker.Models.PreviewNode({contentTypeAlias: '', id: 0, name: 'Choose Node', properties: []});
			$scope.buildChildrenList($scope.config.startNode, $scope.config.doctype, function(children) {
				$scope.list = $scope.getNodesForList(children);
				for (var i = 0; i < $scope.list.length; i++) {
					$scope.addThumbnailToNode(i);
				}
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
			$scope.updateValueFromList();
			$scope.addThumbnailToNode($scope.model.value.split(",").length - 1);
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
		$scope.list.splice(index, 1);
		$scope.updateValueFromList();
	};

	/**
	* @method editItem
	* @param {integer} index - The index (zero-based) of the item.
	* @description Navigate the user to the node of the selected item for editing purposes.
	*/
	$scope.editItem = function(index) {
		var node = $scope.list[index];
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
		$scope.list.splice((index + change), 0, $scope.list.splice(index, 1)[0]);
		$scope.updateValueFromList();
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
						$scope.list[index].thumbnail = url.split('"')[1];
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
					if (propertyAliases && propertyAliases.length > 0) {
						var sortedProperties = [];
						var imageProperty = false;
						propertyAliases.forEach(function (propAlias) {
							filteredProperties.forEach(function (prop) {
								if (prop.alias.toLowerCase() === propAlias.toLowerCase()) {
									sortedProperties.push(prop);
								}
								if (prop.alias.toLowerCase() === $scope.config.image.toLowerCase()) {
									imageProperty = prop;
								}
							});
						});
						if (imageProperty) {
							sortedProperties.push(imageProperty);
						}
						filteredProperties = sortedProperties;
					}

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
	* @method getNodesForList
	* @param {array of previewPicker.Models.PreviewNode} nodes
	* @returns {array of previewPicker.Models.PreviewNode}
	* @description Returns all nodes in $scope.model.value.list.
	*/
	$scope.getNodesForList = function(nodes) {
	    var list = [];
        if ($scope.model.value) {
            var valueList = $scope.model.value.split(",");
            if (valueList.length > 0) {
                valueList.forEach(function (nodeId) {
                    if (nodes && nodes.length > 0) {
                        nodes.forEach(function (node) {
                            if (node.id == nodeId) {
                                list.push(new previewPicker.Models.PreviewNode(node));
                                doesNodeExist = true;
                            }
                        });
                    }
                });
            }
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
			if ($scope.model.value && $scope.model.value.split(",").length > 0) {
				if ($scope.model.value.split(",").length > $scope.config.maximum) {
					isAtMax = true;
				}
			}
		}
		return isAtMax;
	};

	$scope.updateValueFromList = function() {
		var list = $scope.list;
		$scope.model.value = "";
		if (list && list.length > 0) {
		    list.forEach(function (node, index) {
                if (index != 0) {
                    $scope.model.value += ",";
                }
				$scope.model.value += node.id;
			});
		}
	};

	// Call $scope.init() ////////////////////////////////////////////////////////

	$scope.init();

});
