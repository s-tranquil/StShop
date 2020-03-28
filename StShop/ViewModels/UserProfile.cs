namespace StShop.UI.ViewModels
{
    public class UserProfile
    {
        public string Email { get; set; }
        public string Name { get; set; }
        public string Surname { get; set; }
        public string DisplayAddress { get; set; }
        public Address Address { get; set; }
    }
}
