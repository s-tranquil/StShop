using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;

using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using StShop.DAL.Context;
using StShop.UI.ViewModels;

namespace StShop.UI.Controllers
{
    namespace AuthApp.Controllers
    {
        public class AccountController : ControllerBase
        {
            private readonly AllContext _context;
            public AccountController(AllContext context)
            {
                _context = context;
            }

            [HttpPost]
            public async Task<IActionResult> Login([FromBody]LoginModel model)
            {
                DAL.Models.User user = await _context.Users.FirstOrDefaultAsync(u => u.Email == model.Email && u.Password == model.Password);
                if (user != null)
                {
                    await Authenticate(model.Email);
                    return Ok(new ViewModels.User
                    {
                        Email = user.Email
                    });
                }
                return Unauthorized("Wrong login/password");
            }

            [HttpGet]
            public async Task<IActionResult> IsAuthorized()
            {
                var email = HttpContext.User?.Identity?.Name;
                
                DAL.Models.User user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
                if (user != null)
                {
                    return Ok(new ViewModels.User
                    {
                        Email = user.Email
                    });
                }
                return Unauthorized("Not logged in");
            }

            // Get existing user
            [HttpGet]
            public async Task<IActionResult> Register()
            {
                var email = HttpContext.User?.Identity?.Name;
                if (email == null)
                {
                    return Unauthorized("Not logged in");
                }

                var result = await GetRegisterModel(email);
                if (result == null)
                {
                    return Unauthorized("User not found");
                }

                return Ok(result);
            }

            // Add or update user
            [HttpPost]
            public async Task<IActionResult> Register([FromBody]RegisterModel model)
            {
                var user = await GetUser(model.Email);
                if (user == null)
                {
                    user = new DAL.Models.User
                    {
                        Address = new DAL.Models.Address()
                    };
                    _context.Users.Add(user);
                    await Authenticate(model.Email);
                }

                user.Role = DAL.Models.UserRole.Customer;
                user.Email = model.Email;
                user.Password = model.Password;
                user.Name = model.Name;
                user.Surname = model.Surname;
                user.DisplayAddress = model.DisplayAddress;
                user.Address.Country = model.Address.Country;
                user.Address.City = model.Address.City;
                user.Address.Street = model.Address.Street;
                user.Address.House = model.Address.House;
                user.Address.ZipCode = model.Address.ZipCode;

                await _context.SaveChangesAsync();
                var result = await GetRegisterModel(model.Email);
                return Ok(result);
            }

            [HttpPost]
            public async Task<IActionResult> Logout()
            {
                await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
                return Ok();
            }

            private async Task Authenticate(string email)
            {
                var claims = new List<Claim>
                {
                    new Claim(ClaimsIdentity.DefaultNameClaimType, email)
                };
                ClaimsIdentity id = new ClaimsIdentity(claims, "ApplicationCookie", ClaimsIdentity.DefaultNameClaimType, ClaimsIdentity.DefaultRoleClaimType);
                await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(id));
            }

            private async Task<DAL.Models.User> GetUser(string email)
            {
                return await _context.Users
                    .Include(x => x.Address)
                    .FirstOrDefaultAsync(x =>
                        x.Email == email &&
                        x.Role == DAL.Models.UserRole.Customer
                    );
            }

            private async Task<ViewModels.RegisterModel> GetRegisterModel(string email)
            {
                var user = await GetUser(email);

                if (user == null)
                {
                    return null;
                }

                var address = user.Address;

                return new RegisterModel
                {
                    Email = user.Email,
                    DisplayAddress = user.DisplayAddress,
                    Name = user.Name,
                    Surname = user.Surname,
                    Address = new Address
                    {
                        Country = user.Address.Country,
                        City = user.Address.City,
                        Street = user.Address.Street,
                        House = user.Address.House,
                        ZipCode = user.Address.ZipCode
                    }
                };
            }
        }
    }
}
