using Newtonsoft.Json;
using System.Net;

namespace DayFixAPI.Services
{
    public class JokeAPIService
    {
        private const string WEBSERVICE_URL_JOKE = @"https://icanhazdadjoke.com/";
        private HttpWebRequest webRequest;

        public JokeAPIService()
        {
            this.webRequest = (HttpWebRequest)WebRequest.Create(WEBSERVICE_URL_JOKE);
        }

        public string GetRandomJoke()
        {
            string response = string.Empty;

            if (webRequest != null)
            {
                webRequest.Method = "GET";
                webRequest.Timeout = 12000;
                webRequest.Accept = "application/json";

                using (System.IO.Stream s = webRequest.GetResponse().GetResponseStream())
                {
                    using (System.IO.StreamReader sr = new System.IO.StreamReader(s))
                    {
                        var jsonResponse = sr.ReadToEnd();

                        dynamic deserialized = JsonConvert.DeserializeObject(jsonResponse);
                        string joke = deserialized.joke;
                        if (!string.IsNullOrEmpty(joke))
                        {
                            response = joke;
                        }
                    }
                }
            }
            return response;
        }
    }
}
