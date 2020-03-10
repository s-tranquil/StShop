using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using StShop.DAL.Models;

namespace StShop.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class WeatherForecastController : ControllerBase
    {
        private static readonly string[] Summaries = new[]
        {
            "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
        };

        private readonly ILogger<WeatherForecastController> _logger;
        private AllContext _userContext;

        public WeatherForecastController(ILogger<WeatherForecastController> logger, AllContext userContext)
        {
            _logger = logger;
            _userContext = userContext;
        }

        [HttpGet]
        public IEnumerable<WeatherForecast> Get()
        {
            //var rng = new Random();
            //return Enumerable.Range(1, 5).Select(index => new WeatherForecast
            //{
            //    Date = DateTime.Now.AddDays(index),
            //    TemperatureC = rng.Next(-20, 55),
            //    Summary = Summaries[rng.Next(Summaries.Length)]
            //})
            //.ToArray();

            _userContext.Users.Add(new DAL.Models.User
            {
                Username = "dd",
                Role = UserRole.Admin
            });

            _userContext.SaveChanges();

            return _userContext.Users.Select(x => new WeatherForecast { Summary = $"{x.Username} {x.UserId} {x.Role}" });
        }
    }
}
