using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace StShop.DAL.Models
{
    public class OrderPosition
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long OrderPositionId { get; set; }

        [Required]
        public virtual IEnumerable<SupplierProduct> SupplierProducts { get; set; }

        [Required]
        public decimal Quantity { get; set; }
    }
}
