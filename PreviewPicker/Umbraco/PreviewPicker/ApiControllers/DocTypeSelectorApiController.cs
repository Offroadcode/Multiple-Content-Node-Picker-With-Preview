using System;
using System.Collections.Generic;
using System.Web;
using System.Linq;
using Umbraco.Web.Editors;
using Umbraco.Web.Mvc;

[PluginController("DocTypeSelector")]
public class DocTypeSelectorApiController : UmbracoAuthorizedJsonController
{

    public object GetAllDocTypes()
    {
        var docTypes = new List<Object>();
        foreach (var doctype in Services.ContentTypeService.GetAllContentTypes().OrderBy(d => d.Name))
        {
            docTypes.Add(new { id = doctype.Id, alias = doctype.Alias, name = doctype.Name });
        }

        return docTypes;
    }

    public object GetPropertiesForDocType(int id)
    {
        var props = new List<Object>();
        foreach (var prop in Services.ContentTypeService.GetContentType(id).PropertyTypes)
        {
            props.Add(new { id = prop.Id, alias = prop.Alias, selected = false });
        }

        return props;
    }
}
