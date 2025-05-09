namespace eCommerceApi.Service
{
    using RestSharp;
    using Newtonsoft.Json.Linq;
    using System;
    using System.Text;
    using System.Threading.Tasks;
    using eCommerceApi.Models;
    using Microsoft.EntityFrameworkCore;
    using Newtonsoft.Json;
    using Microsoft.Extensions.Options;

    public class MpesaService
    {
        private readonly MpesaConfig _mpesaConfig;
        private readonly ApplicationDbContext _dbContext;

        public MpesaService(ApplicationDbContext dbContext, IOptions<MpesaConfig> mpesaConfig)
        {
            _dbContext = dbContext;
            _mpesaConfig = mpesaConfig.Value;
        }

        // Get Access Token
        public async Task<string> GetAccessTokenAsync()
        {
            try
            {
                var options = new RestClientOptions
                {
                    BaseUrl = new Uri("https://sandbox.safaricom.co.ke")
                };

                var client = new RestClient(options);
                var request = new RestRequest("/oauth/v1/generate?grant_type=client_credentials", Method.Get);

                string credentials = Convert.ToBase64String(Encoding.UTF8.GetBytes($"{_mpesaConfig.ConsumerKey}:{_mpesaConfig.ConsumerSecret}"));
                request.AddHeader("Authorization", $"Basic {credentials}");

                var response = await client.ExecuteAsync(request);

                if (response.IsSuccessful && !string.IsNullOrEmpty(response.Content))
                {
                    var json = JObject.Parse(response.Content);
                    return json["access_token"]?.ToString();
                }
                else
                {
                    Console.WriteLine($"Failed to retrieve access token: {response.Content}");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error retrieving access token: {ex.Message}");
            }

            return null;
        }

        // Initiate STK Push
        public async Task<string> InitiateStkPush(string phoneNumber, double amount, string orderId)
        {
            var accessToken = await GetAccessTokenAsync();
            if (string.IsNullOrEmpty(accessToken))
            {
                return "Failed to retrieve access token.";
            }

            Console.WriteLine($"Access Token: {accessToken}");

            var timestamp = DateTime.UtcNow.ToString("yyyyMMddHHmmss");
            var password = Convert.ToBase64String(Encoding.UTF8.GetBytes($"{_mpesaConfig.BusinessShortCode}{_mpesaConfig.PassKey}{timestamp}"));

            //Console.WriteLine("BusinessShortCode: {_mpesaConfig.BusinessShortCode}");
            //Console.WriteLine("Timestamp: {timestamp}");
            //Console.WriteLine("Generated Password: {password}");

            var requestPayload = new MpesaRequestModel
            {
                BusinessShortCode = _mpesaConfig.BusinessShortCode,
                Password = password,
                Timestamp = timestamp,
                TransactionType = "CustomerPayBillOnline",
                Amount = amount,
                PartyA = phoneNumber,
                PartyB = _mpesaConfig.BusinessShortCode,
                PhoneNumber = phoneNumber,
                CallBackURL = _mpesaConfig.CallbackUrl,
                AccountReference = orderId,
                TransactionDesc = "Payment for Order #{orderId}"
            };

            //Console.WriteLine($"Request Payload: {JsonConvert.SerializeObject(requestPayload)}");

            var options = new RestClientOptions
            {
                BaseUrl = new Uri("https://sandbox.safaricom.co.ke")  // Change to production URL if needed
            };

            var client = new RestClient(options);
            var request = new RestRequest("/mpesa/stkpush/v1/processrequest", Method.Post);

            request.AddHeader("Authorization", "Bearer {accessToken}");
            request.AddHeader("Content-Type", "application/json");
            request.AddJsonBody(requestPayload);

            var response = await client.ExecuteAsync(request);

            Console.WriteLine($"Full Response: {response.Content}");

            if (!response.IsSuccessful || string.IsNullOrEmpty(response.Content))
            {
                Console.WriteLine("STK Push Failed: {response.Content}");
                return "STK Push request failed. Response: {response.Content}";
            }

            var jsonResponse = JObject.Parse(response.Content);
            string checkoutRequestId = jsonResponse["CheckoutRequestID"]?.ToString();

            //Console.WriteLine($"CheckoutRequestID: {checkoutRequestId}");

            return response.Content;
        }
    }
}
