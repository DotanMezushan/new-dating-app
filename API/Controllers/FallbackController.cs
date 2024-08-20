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
                var directory = Directory.GetCurrentDirectory();
        var files = Directory.GetFiles(Path.Combine(directory, "wwwroot"));
        return NotFound($"File not found: {filePath}. Current directory: {directory}. Files in wwwroot: {string.Join(", ", files)}");
            }

            return PhysicalFile(filePath, "text/html");
        }
    }
}
