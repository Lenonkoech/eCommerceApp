using eCommerceApi.DTOs;
using eCommerceApi.Service;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json.Linq;
using System.Threading.Tasks;

[ApiController]
[Route("api/mpesa")]
public class MpesaController : ControllerBase
{
    private readonly MpesaService _mpesaService;
    private readonly ApplicationDbContext _dbContext;

    public MpesaController(MpesaService mpesaService, ApplicationDbContext dbContext)
    {
        _mpesaService = mpesaService;
        _dbContext = dbContext;
    }

    // Endpoint to trigger STK Push
    [HttpPost("stkpush")]
    public async Task<IActionResult> StkPushRequest([FromBody] StkPushRequestDto request)
    {
        if (request == null || string.IsNullOrEmpty(request.PhoneNumber) || request.Amount <= 0 || string.IsNullOrEmpty(request.OrderId))
        {
            return BadRequest(new { message = "Invalid request data" });
        }

        try
        {
            var response = await _mpesaService.InitiateStkPush(request.PhoneNumber, request.Amount, request.OrderId);
            return Ok(new { message = "STK Push request sent successfully", response });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "STK Push request failed", error = ex.Message });
        }
    }


    // Callback URL to process payment results
    [HttpPost("callback")]
    public async Task<IActionResult> MpesaCallback([FromBody] JObject callbackData)
    {
        var resultCode = callbackData["Body"]?["stkCallback"]?["ResultCode"]?.ToString();
        var checkoutRequestId = callbackData["Body"]?["stkCallback"]?["CheckoutRequestID"]?.ToString();
        var mpesaReceiptNumber = callbackData["Body"]?["stkCallback"]?["CallbackMetadata"]?["Item"]?[0]?["Value"]?.ToString();

        var transaction = await _dbContext.MpesaTransactions.FirstOrDefaultAsync(t => t.CheckoutRequestId == checkoutRequestId);
        if (transaction != null)
        {
            transaction.Status = resultCode == "0" ? "Success" : "Failed";
            transaction.MpesaReceiptNumber = resultCode == "0" ? mpesaReceiptNumber : null;

            await _dbContext.SaveChangesAsync();
        }

        return Ok();
    }

}
