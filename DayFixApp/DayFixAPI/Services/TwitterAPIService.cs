using LinqToTwitter;
using System.Collections.Generic;
using System.Net;
using System.Threading.Tasks;

namespace DayFixAPI.Services
{
    public class TwitterAPIService
    {
        private readonly static TwitterContext context = new TwitterContext(new SingleUserAuthorizer
        {
            CredentialStore = new SingleUserInMemoryCredentialStore
            {
                ConsumerKey = "", // API Key
                ConsumerSecret = "", // API Consumer Secret
                AccessToken = "",
                AccessTokenSecret = ""
            }
        });


        public async Task PostTweet(string imageurl, string text)
        {
            const string mediaType = "image/jpg";
            const string mediaCategory = "tweet_image";
            byte[] imageBytes;

            try
            {
                using (var webClient = new WebClient())
                {
                    imageBytes = webClient.DownloadData(imageurl);
                }
                var uploadedMedia = await context.UploadMediaAsync(imageBytes, mediaType, mediaCategory);
                var mediaIds = new List<ulong> { uploadedMedia.MediaID };
                await context.TweetAsync(text, mediaIds);
            }
            catch
            {

            }
        }
    }
}
