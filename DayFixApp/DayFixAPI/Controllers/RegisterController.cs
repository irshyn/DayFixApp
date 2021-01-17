using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using DayFixAPI.Models;
using DayFixAPI.Services;
using Microsoft.Extensions.Configuration;

namespace DayFixAPI.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]
    public class RegisterController : ControllerBase
    {
        private IConfiguration _config;
        private readonly DayFixContext _context;

        public RegisterController(IConfiguration config, DayFixContext context)
        {
            _config = config;
            _context = context;

            if (!_context.RegisteredUsers.Any(ru => ru.UserName=="admin"))
            {
                // Create a default admin account
                _context.RegisteredUsers.Add(new UserModel { UserName = "admin", Password = "password", EmailAddress = "admin@conestogac.on.ca" });
                _context.SaveChanges();
            }
        }

        // POST: api/v1/Register
        [HttpPost]
        public async Task<ActionResult<UserModel>> RegisterUser(UserModel newuser)
        {
            if (string.IsNullOrEmpty(newuser.UserName) || string.IsNullOrEmpty(newuser.Password) || string.IsNullOrEmpty(newuser.EmailAddress))
            {
                return BadRequest("Information missing.");
            }
            if (_context.RegisteredUsers.Any(ru => ru.UserName == newuser.UserName))
            {
                return BadRequest("User under this name already exists. Please pick another name.");
            }            
            _context.RegisteredUsers.Add(newuser);
            await _context.SaveChangesAsync();

            var tokenStr = JWTService.GenerateToken(_config, newuser);
            return Ok(new { token = tokenStr });
        }
    }
}