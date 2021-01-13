using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DayFixAPI.Models;
using DayFixAPI.Services;
using Microsoft.AspNetCore.Cors;

namespace DayFixAPI.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]
    [EnableCors("CorsPolicy")]
    public class DayFixController : ControllerBase
    {
        private readonly DayFixContext _context;

        public DayFixController(DayFixContext context)
        {
            _context = context;
        }

        // GET: api/v1/DayFix
        [HttpGet]
        public async Task<ActionResult<IEnumerable<DayFix>>> GetDayFixes()
        {
            return await _context.DayFixes.ToListAsync();
        }

        #region get dayfix by id
        // GET: api/v1/DayFix/5
        [HttpGet("{id}")]
        public async Task<ActionResult<DayFix>> GetDayFix(long id)
        {
            var dayFix = await _context.DayFixes.FindAsync(id);

            if (dayFix == null)
            {
                return NotFound();
            }
            return dayFix;
        }
        #endregion

        #region post new dayfix
        // POST: api/v1/DayFix
        [HttpPost]
        public async Task<ActionResult<DayFix>> PostDayFix()
        {
            var dayFix = new DayFix();
            // to create a new dayfix, we will make requests use our API intergrations
            try
            {
                var catApiService = new CatAPIService();
                dayFix.CatImage = catApiService.GetRandomCatImage();

                var jokeApiService = new JokeAPIService();
                dayFix.DadJoke = jokeApiService.GetRandomJoke();

                // if the dayfix object wasn't properly formed, return an error
                if (string.IsNullOrEmpty(dayFix.CatImage) || string.IsNullOrEmpty(dayFix.DadJoke))
                {
                    return StatusCode(StatusCodes.Status500InternalServerError);
                }
            }
            catch
            {
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
            _context.DayFixes.Add(dayFix);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetDayFix", new { id = dayFix.Id }, dayFix);
        }
        #endregion

        #region delete dayfix by id
        // DELETE: api/v1/DayFix/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<DayFix>> DeleteDayFix(long id)
        {
            var dayFix = await _context.DayFixes.FindAsync(id);
            if (dayFix == null)
            {
                return NotFound();
            }

            _context.DayFixes.Remove(dayFix);
            await _context.SaveChangesAsync();

            return dayFix;
        }
        #endregion

        #region post dayfix to twitter
        // POST: api/v1/DayFix/TwitterPost/5
        [HttpPost("TwitterPost/{id}")]
        public async Task<ActionResult<DayFix>> PostDayFixToTwitter(long id)
        {
            var dayFix = await _context.DayFixes.FindAsync(id);
            if (dayFix == null)
            {
                return NotFound();
            }
            var twitterService = new TwitterAPIService();
            try
            {
                var result = Task.Run(() => twitterService.PostTweet(dayFix.CatImage, dayFix.DadJoke));
                result.Wait();
                if (result == null)
                {
                    return StatusCode(StatusCodes.Status500InternalServerError, new { errorMessage = "Tweet not posted" });
                }
                else
                {
                    return Ok("Tweet posted");
                }
            }
            catch
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { errorMessage = "Tweet not posted" });
            }
        }
        #endregion
    }
}