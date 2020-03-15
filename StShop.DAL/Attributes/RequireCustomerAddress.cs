using System.ComponentModel.DataAnnotations;

using StShop.DAL.Models;

namespace StShop.DAL.Attributes
{
    public class RequireCustomerAddressAttribute : ValidationAttribute
    {
        protected override ValidationResult IsValid(object value, ValidationContext validationContext)
        {
            var user = (User)validationContext.ObjectInstance;
            if (user.Role == UserRole.Admin)
            {
                return ValidationResult.Success;
            }
            return value == null ? new ValidationResult("Address is required for customer.") : ValidationResult.Success;
        }
    }
}
