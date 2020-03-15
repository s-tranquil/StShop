using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace StShop.DAL.Models
{
    public class DiscountCoupon
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int DicountCouponId { get; set; }
        
        [Required]
        public byte DiscountPercent { get; set; }

        public IEnumerable<ProductCategory> ProductCategories { get; set; }
    }
}
