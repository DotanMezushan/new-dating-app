namespace API.Utils
{
    public class MessageParams : PaginationParams
    {
        public string? UserName { get; set; }
        public string? Container { get; set; } = "UnRead";
    }
}
