using Microsoft.EntityFrameworkCore;

namespace DayFixAPI.Models
{
    public class DayFixContext : DbContext
    {
        public DayFixContext(DbContextOptions<DayFixContext> options)
            : base(options)
        {
        }

        public DbSet<DayFix> DayFixes { get; set; }
        public DbSet<UserModel> RegisteredUsers { get; set; }
    }
}
