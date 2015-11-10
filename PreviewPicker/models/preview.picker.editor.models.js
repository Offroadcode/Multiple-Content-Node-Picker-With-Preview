(function(models, undefined) {

	/**
	* @class PreviewPicker
	* @this PreviewPicker
	* @param {JSON} data
	* @description Class defining a Preview Picker, which displays a content picker (multiple or single) with a preview display.
	*/
	models.PreviewPicker = function(data) {
		var self = this;
	};

	models.PreviewConfig = function(data) {
		var self = this;
		self.doctype = "";
		self.image = "";
		self.maximum = 0;
		self.minimum = 0;
		self.properties = [];
		self.startNode = 0;
		if (data !== undefined) {
			if (data.doctype !== undefined) {
				self.doctype = data.doctype;
			}
			if (data.image !== undefined) {
				self.image = data.image;
			}
			if (data.maximum !== undefined && data.maximum !== null) {
				self.maximum = data.maximum;
			}
			if (data.minimum !== undefined && data.minimum !== null) {
				self.minimum = data.minimum;
			}
			if (data.properties !== undefined) {
				if ((typeof data.properties) === "string") {
					self.properties = data.properties.split(",");
				} else {
					self.properties = data.properties;
				}
			}
			if (data.startNode !== undefined && data.startNode !== null) {
				self.startNode = data.startNode;
			}
		}
	};

	/**
	* @method PreviewMode
	*/
	models.PreviewNode = function(data) {
		var self = this;
		self.contentTypeAlias = "";
		self.id = 0;
		self.name = "";
		self.thumbnail = "";
		self.properties = [];
		self.published = false;
		if (data !== undefined) {
			if (data.contentTypeAlias !== undefined) {
				self.contentTypeAlias = data.contentTypeAlias;
			}
			if (data.id !== undefined) {
				self.id = data.id;
			}
			if (data.name !== undefined) {
				self.name = data.name;
			}
			if (data.properties !== undefined) {
				self.properties = data.properties.map(function(property) {
					return new previewPicker.Models.PreviewProperty(property);
				});
			}
			if (data.published !== undefined) {
				self.published = data.published;
			}
			if (data.thumbnail !== undefined) {
				self.thumbnail = data.thumbnail;
			}
		}
	};

	/**
	* @class PreviewProperty
	* @this PreviewProperty
	* @param {JSON} data
	* @param {string} data.alias - The alias for the property.
	* @param {string} data.editor - The editor alias string for the type of property editor to use.
	* @param {integer} data.id - The unique id for the property.
	* @param {string} data.value - The property's saved value.
	* @description Class defining a property inside a content node.
	*/
	models.PreviewProperty = function(data) {
		var self = this;
		self.alias = "";
		self.editor = "";
		self.id = 0;
		self.value = "";
		if (data !== undefined) {
			if (data.alias !== undefined) {
				self.alias = data.alias;
			}
			if (data.editor !== undefined) {
				self.editor = data.editor;
			}
			if (data.id !== undefined) {
				self.id = data.id;
			}
			if (data.value !== undefined) {
				self.value = data.value;
			}
		}
	};

}(window.previewPicker.Models = window.previewPicker.Models || {}));
