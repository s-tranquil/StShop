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

            // TODO: add admin user to EF initial migration

            [HttpPost]
            //[ValidateAntiForgeryToken]
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

            //[HttpPost]
            ////[ValidateAntiForgeryToken]
            //public async Task<IActionResult> Register(RegisterModel model)
            //{
            //    DAL.Models.User user = await _context.Users.FirstOrDefaultAsync(u => u. == model.Email);
            //    if (user == null)
            //    {
            //        // добавляем пользователя в бд
            //        db.Users.Add(new User { Email = model.Email, Password = model.Password });
            //        await db.SaveChangesAsync();

            //        await Authenticate(model.Email); // аутентификация

            //        return OkResult(
            //            new ViewModels.User
            //            {
            //                Email = model.Email,

            //            }
            //        );
            //    }
            //    else
            //        ModelState.AddModelError("", "Некорректные логин и(или) пароль");
            //}

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
