using Microsoft.AspNetCore.Mvc;
using Serenity.Web;

namespace DashboardSample.Common.Pages
{
    [Route("Dashboard/[action]")]
    public class DashboardController : Controller
    {
        [PageAuthorize, HttpGet, Route("~/")]
        public ActionResult Index()
        {
            return View(MVC.Views.Common.Dashboard.DashboardIndex);
        }
    }
}
