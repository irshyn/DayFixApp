using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using DayFixAPI.Models;
using DayFixAPI.Services;

namespace DayFixAPI.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        private IConfiguration _config;
        private readonly DayFixContext _context;

        public LoginController(IConfiguration config, DayFixContext context)
        {
            _config = config;
            _context = context;
            if (!_context.RegisteredUsers.Any(ru => ru.UserName == "admin"))
            {
                // Create a default admin account
                _context.RegisteredUsers.Add(new UserModel { UserName = "admin", Password = "password", EmailAddress = "admin@conestogac.on.ca" });
                _context.SaveChanges();
            }
        }

        [HttpPost]
        public IActionResult Login(UserModel user)
        {
            UserModel login = new UserModel();
            login.UserName = user.UserName;
            login.Password = user.Password;
            IActionResult response = Unauthorized();

            var authenticatedUser = _context.RegisteredUsers.FirstOrDefault(ru => ru.UserName == login.UserName && ru.Password == login.Password);

            if (authenticatedUser != null)
            {
                var tokenStr = JWTService.GenerateToken(_config, authenticatedUser);
                response = Ok(new { token = tokenStr });
            }
            return response;
        }

        [Authorize]
        [HttpPost("Post")]
        public string Post()
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            IList<Claim> claim = identity.Claims.ToList();
            var userName = claim[0].Value;
            return "Welcome to " + userName;
        }
    }
}