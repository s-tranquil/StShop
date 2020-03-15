using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

using StShop.DAL.Attributes;

namespace StShop.DAL.Models
{
    public class User
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long UserId { get; set; }
        [Required]
        public string Email { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public string Surname { get; set; }
        [Required]
        public string Password { get; set; }
        
        [Required]
        public UserRole Role { get; set; }

        [RequireCustomerAddress]
        [ForeignKey("AddressId")]
        public virtual Address Address { get; set; }
        [RequireCustomerAddress]
        public string DisplayAddress { get; set; }

        public virtual IEnumerable<Order> Orders { get; set; }
    }   
}
