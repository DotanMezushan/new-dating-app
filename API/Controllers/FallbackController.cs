using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class FallbackController : Controller
    {
        //public ActionResult Index()
        //{
        //    return PhysicalFile(Path.Combine(Directory.GetCurrentDirectory(),
        //        "wwwroot", "index.html"), "text/HTML");
        //}

        public IActionResult Index()
        {
            var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "index.html");

            if (!System.IO.File.Exists(filePath))
            {
                // Handle the file not found scenario, e.g., return a 404 page
                throw new Exception(Directory.GetCurrentDirectory().ToString() + "File place issue ");
                //return NotFound("");
            }

            return PhysicalFile(filePath, "text/html");
        }
    }
}
