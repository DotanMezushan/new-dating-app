using System.Security.Claims;

namespace API.Extensions
{
    public static class CliamsPrinipleExtensions
    {
        public static string GetUserName (this ClaimsPrincipal User)
        {
            var userName = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userName != null)
            {
                return userName;
            }
            else
            {
                return "";
            }
        }
    }
}
