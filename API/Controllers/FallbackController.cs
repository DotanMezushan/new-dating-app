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
                return NotFound($"File not found: {filePath} {Directory.GetCurrentDirectory()}");
            }

            return PhysicalFile(filePath, "text/html");
        }
    }
}
