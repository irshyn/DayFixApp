using Newtonsoft.Json;
using System.Net;

namespace DayFixAPI.Services
{
    public class CatAPIService
    {
        private const string WEBSERVICE_URL_CAT = @"https://api.thecatapi.com/v1/images/search";
        private WebRequest webRequest;

        public CatAPIService()
        {
            this.webRequest = WebRequest.Create(WEBSERVICE_URL_CAT);
        }

        public string GetRandomCatImage()
        {
            string response = string.Empty;

            if (webRequest != null)
            {
                webRequest.Method = "GET";
                webRequest.Timeout = 12000;
                webRequest.ContentType = "application/json";
                webRequest.Headers.Add("x-api-key", "6d54d598-f4aa-4cac-8abf-2524822a6d66");

                do
                {
                    using (System.IO.Stream s = webRequest.GetResponse().GetResponseStream())
                    {
                        using (System.IO.StreamReader sr = new System.IO.StreamReader(s))
                        {
                            var jsonResponse = sr.ReadToEnd();

                            dynamic deserialized = JsonConvert.DeserializeObject(jsonResponse);
                            string catImageUrl = deserialized[0].url;
                            if (!string.IsNullOrEmpty(catImageUrl))
                            {
                                response = catImageUrl;
                            }
                        }
                    }
                } while (response.EndsWith(".gif")); // to avoid posting to twitter gif files                
            }
            return response;
        }
    }
}
