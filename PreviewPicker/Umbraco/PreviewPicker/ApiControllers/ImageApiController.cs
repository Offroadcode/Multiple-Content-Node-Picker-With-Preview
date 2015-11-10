namespace PreviewPicker.ApiControllers
{
    using Umbraco.Web;
    using Umbraco.Web.Editors;
    using Umbraco.Web.Mvc;
    using Umbraco.Web.WebApi;

    [PluginController("Image")]
    public class ImageApiController : UmbracoAuthorizedApiController
    {
        [System.Web.Http.AcceptVerbs("GET")]
        public string GetImageUrlById(int id)
        {
            var umbraco = new UmbracoHelper(UmbracoContext.Current);

            return umbraco.TypedMedia(id).Url;
        }
    }  
}
