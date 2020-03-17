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
            public IActionResult IsAuthorized()
            {
                var hasClaim = HttpContext.User?.Identity?.Name;
                return Ok(new
                {
                    IsAuthorized = hasClaim
                });
            }
            //[HttpGet]
            //public IActionResult Register()
            //{
            //    return View();
            //}

            [HttpPost]
            public async Task<IActionResult> Register([FromBody]RegisterModel model)
            {
                DAL.Models.User user = await _context.Users.FirstOrDefaultAsync(u => u.Email == model.Email);
                if (user == null)
                {
                    _context.Users.Add(new DAL.Models.User { 
                        Role = DAL.Models.UserRole.Customer,
                        Email = model.Email,
                        Password = model.Password,
                        Name = model.Name,
                        Surname = model.Surname,
                        DisplayAddress = model.DisplayAddress,
                        Address = new DAL.Models.Address
                        {
                            Country = model.Address.Country,
                            City = model.Address.City,
                            Street = model.Address.Street,
                            House = model.Address.House,
                            ZipCode = model.Address.ZipCode
                        }
                    });
                    await _context.SaveChangesAsync();

                    await Authenticate(model.Email);

                    return Ok(
                        new ViewModels.User
                        {
                            Email = model.Email,
                        }
                    );
                }
                else
                {
                    return Forbid();
                }
            }

            private async Task Authenticate(string userName)
            {
                // создаем один claim
                var claims = new List<Claim>
                {
                    new Claim(ClaimsIdentity.DefaultNameClaimType, userName)
                };
                // создаем объект ClaimsIdentity
                ClaimsIdentity id = new ClaimsIdentity(claims, "ApplicationCookie", ClaimsIdentity.DefaultNameClaimType, ClaimsIdentity.DefaultRoleClaimType);
                // установка аутентификационных куки
                await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(id));
            }

            public async Task<IActionResult> Logout()
            {
                await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
                return RedirectToAction("Login", "Account");
            }
        }
    }
}
