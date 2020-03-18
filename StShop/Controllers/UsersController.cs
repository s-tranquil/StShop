using System.Collections.Generic;
using System.Linq;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

using StShop.DAL.Context;
using StShop.UI.ViewModels;

namespace StShop.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UsersController : ControllerBase
    {

        private readonly ILogger<UsersController> _logger;
        private AllContext _context;

        public UsersController(ILogger<UsersController> logger, AllContext context)
        {
            _logger = logger;
            _context = context;
        }

        [HttpGet("GetAll")]
        [Authorize]
        public IEnumerable<UserDisplayItem> GetAll()
        {
            var result = _context.Users.Select(x =>
                new UserDisplayItem
                {
                    Email = x.Email,
                    Name = x.Name,
                    Surname = x.Surname,
                    DisplayAddress = x.DisplayAddress
                }
            )
            .ToList();

            return result;
        }
    }
}
