using Microsoft.Extensions.Options;
using System.Text.Json;

namespace API.Utils
{
    public static class HttpExtensions
    {
        public static void AddPaginationHeader(this HttpResponse httpResponse, 
            int currentPage, int itemsPerPage, int totalItems, int totalPages )
        {
            var paginationHeader = new PaginationHeader(currentPage, itemsPerPage, totalItems, totalPages);
            var options = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            };

            var paginationJson = JsonSerializer.Serialize(paginationHeader, options);
            httpResponse.Headers.Append("Pagination", paginationJson);
            httpResponse.Headers.Append("Access-Control-Expose-Headers", "Pagination");

        }
    }
}
