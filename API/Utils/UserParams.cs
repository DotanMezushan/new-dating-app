namespace API.Utils
{
    public class UserParams: PaginationParams
    {
        public string? CurrentUserName { get; set; }
        public string Gender { get; set; }
        public int MinAge { get; set; } = 18;
        public int MaxAge { get; set; } = 123;
        public string? OrderBy { get; set; }
    }
}
