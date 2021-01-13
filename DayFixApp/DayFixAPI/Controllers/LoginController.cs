using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using DayFixAPI.Models;

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
                var tokenStr = GenerateJSONWebToken(authenticatedUser);
                response = Ok(new { token = tokenStr });
            }
            return response;
        }

        private string GenerateJSONWebToken(UserModel user)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.UserName),
                new Claim(JwtRegisteredClaimNames.Email, user.EmailAddress),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            };

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Issuer"],
                claims,
                expires: DateTime.Now.AddMinutes(120),
                signingCredentials: credentials
                );

            var encodedtoken = new JwtSecurityTokenHandler().WriteToken(token);

            return encodedtoken;
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

        [Authorize]
        [HttpGet("GetValue")]
        public ActionResult<IEnumerable<string>> Get()
        {
            return new string[] { "Value1", "Value2", "Value3" };
        }
    }
}