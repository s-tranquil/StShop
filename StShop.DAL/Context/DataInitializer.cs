using Microsoft.EntityFrameworkCore;

using StShop.DAL.Models;

namespace StShop.DAL.Context
{
    public static class DataInitializer
    {
        public static void SeedData(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>().HasData(
                new User
                {
                    UserId = 1,
                    Email = "a@a.com",
                    Password = "123",
                    Role = UserRole.Admin,
                    Name = "Mikhail",
                    Surname = "Stepanov"
                }
            );
        }
    }
}
