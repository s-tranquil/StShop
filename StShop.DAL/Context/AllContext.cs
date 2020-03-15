using System.Linq;

using Microsoft.EntityFrameworkCore;

using StShop.DAL.Models;

namespace StShop.DAL.Context
{
    public class AllContext : DbContext
    {
        public AllContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<DiscountCoupon> DiscountCoupons { get; set; }


        public DbSet<Address> Addresses { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<ProductCategory> ProductCategories { get; set; }
        public DbSet<Supplier> Suppliers { get; set; }
        public DbSet<SupplierProduct> SupplierProducts { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            var decimalProps = modelBuilder.Model
                .GetEntityTypes()
                .SelectMany(t => t.GetProperties())
                .Where(p => p.ClrType == typeof(decimal));

            foreach (var property in decimalProps)
            {
                // for decimal prices and weights
                property.SetColumnType("decimal(12, 3)");
            }

            //modelBuilder
            //    .Entity<DiscountCoupon>()
            //    .HasMany(x => x.ProductCategories)
            //    .WithOne();

            DataInitializer.SeedData(modelBuilder);
        }

    }
}
