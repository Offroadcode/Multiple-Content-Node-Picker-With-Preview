# Multiple Content Picker with Preview

A custom property editor for Umbraco that allows content to be selected and display a configured preview.

## Download for Umbraco

Install the selected release through the Umbraco package installer or download and install locally from Our.

After installing the package, create a new DataType and select "Multi-Node Content Picker with Preview" from the property editor dropdown, then add it to a DocType of your choice.

### Using in a View

This property editor renders it's data in the same way as a Multi-Node Treepicker - the IDs of the content items selected. Therefore, you render it in the same way.

#### Single Node

	if(Model.Content.HasProperty("previewItem") && Model.Content.HasValue("previewItem") {
    	
		var item = Umbraco.TypedContent(Model.Content.GetPropertyValue("previewItem"));
		
		if(item != null) {
			@* item is rendered as IPublishedContent *@
			<h2>@item.Name</h2>
		}
    }

#### Multi-Node

	if(Model.Content.HasProperty("previewItems") && Model.Content.HasValue("previewItems") {
		
		foreach(var id in Model.Content.GetPropertyValue<string[]>("previewItems") {
			
			var item = Umbraco.TypedContent(id);

			if(item != null) {
		        @* item is rendered as IPublishedContent *@
		        <h2>@item.Name</h2>
		    }
		}
	}

## Contribute

Want to contribute to the Multiple Content Picker with Preview package? You'll want to use Grunt (our task runner) to help you integrate with a local copy of Umbraco.

### Install Dependencies
*Requires Node.js to be installed and in your system path*

    npm install -g grunt-cli && npm install -g grunt
    npm install

### Build

    grunt

Builds the project to /dist/. These files can be dropped into an Umbraco 7 site, or you can build directly to a site using:

    grunt --target="D:\inetpub\mysite"

You can also watch for changes using:

    grunt watch
    grunt watch --target="D:\inetpub\mysite"
