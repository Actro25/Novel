using NovelProject.AlterModels;
using System.Net;

namespace NovelProject.Middlewares
{
    public class ExceptionhandlingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionhandlingMiddleware> _logger;

        public ExceptionhandlingMiddleware(RequestDelegate next, ILogger<ExceptionhandlingMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                await HandleExceptionAsync(context, ex);
            }
        }

        private async Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            var error = new ErrorModel
            {
                Message = exception.Message,
                ExeptionType = exception.GetType().Name,
                StatusCode = HttpStatusCode.InternalServerError,
                StackTrace = exception.StackTrace,
                DateError = DateTime.UtcNow,
                UserName = context.User.Identity?.IsAuthenticated == true
                    ? context.User.Identity.Name
                    : "UnAuthorized",
                UserId = context.User.Identity?.IsAuthenticated == true
                    ? int.Parse(context.User.FindFirst("UserId")?.Value ?? "0")
                    : 0
            };

            _logger.LogError(error.ToString());

            // Лог у файл
            var logPath = Path.Combine(Directory.GetCurrentDirectory(), "ErrorExceptions", "log.txt");
            var logMessage = $"""
            --- [{DateTime.Now:yyyy-MM-dd HH:mm:ss}] ---
            User: {error.UserName} (ID: {error.UserId})
            Type: {error.ExeptionType}
            Message: {error.Message}
            StackTrace: {error.StackTrace}
            -----------------------------
            """;
            await File.AppendAllTextAsync(logPath, logMessage);

            // Перевіряємо, чи клієнт очікує HTML чи JSON
            var isHtml = context.Request.Headers["Accept"].Any(h => h.Contains("text/html"));

            if (isHtml)
            {
                context.Response.Clear();
                context.Response.Redirect("/Home/Error");
            }
            else
            {
                context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                context.Response.ContentType = "application/json";
                await context.Response.WriteAsJsonAsync(error);
            }
        }
    }
}
