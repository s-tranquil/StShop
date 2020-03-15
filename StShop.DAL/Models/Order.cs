using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace StShop.DAL.Models
{
    public class Order
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long OrderId { get; set; }
        [Required]
        public DateTime OrderPlacedDate { get; set; }

        // Total price of the order positions
        [Required]
        public decimal TotalPrice { get; set; }

        [Required]
        public virtual IEnumerable<OrderPosition> OrderPositions { get; set; }
    }
}
