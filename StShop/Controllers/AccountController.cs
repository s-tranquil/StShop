using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StShop.DAL.Models;
using StShop.UI.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

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
                User user = await _context.Users.FirstOrDefaultAsync(u => u.Username == model.Email && u.Password == model.Password);
                if (user != null)
                {
                    await Authenticate(model.Email);
                    return Ok();
                }
                return Unauthorized("Wrong login/password");
            }

            [HttpGet]
            public IActionResult IsAuthorized()
            {
                var hasClaim = HttpContext.User?.Identity?.Name;
                return Ok(new {
                    IsAuthorized = hasClaim
                });
            }
            //[HttpGet]
            //public IActionResult Register()
            //{
            //    return View();
            //}
            //[HttpPost]
            //[ValidateAntiForgeryToken]
            //public async Task<IActionResult> Register(RegisterModel model)
            //{
            //    if (ModelState.IsValid)
            //    {
            //        User user = await db.Users.FirstOrDefaultAsync(u => u.Email == model.Email);
            //        if (user == null)
            //        {
            //            // добавляем пользователя в бд
            //            db.Users.Add(new User { Email = model.Email, Password = model.Password });
            //            await db.SaveChangesAsync();

            //            await Authenticate(model.Email); // аутентификация

            //            return RedirectToAction("Index", "Home");
            //        }
            //        else
            //            ModelState.AddModelError("", "Некорректные логин и(или) пароль");
            //    }
            //    return View(model);
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
