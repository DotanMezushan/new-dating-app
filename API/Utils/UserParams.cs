namespace API.Utils
{
    public class UserParams
    {
        public const int MaxPageSize = 50;
        public int PageNumber { get; set; } = 1;
        private int pageSize = 10;
        public string? CurrentUserName { get; set; }
        public string Gender { get; set; }
        public int MinAge { get; set; } = 18;
        public int MaxAge { get; set; } = 123;

        public int PageSize {
            get { return pageSize; } 
            set => pageSize = (value > MaxPageSize) ? MaxPageSize : value;
        }


    }
}
