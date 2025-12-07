using System.Net;
using System.Text.Json;

namespace NovelProject.AlterModels
{
    public class ErrorModel
    {
        public Guid ErrorId { get; set; } = Guid.NewGuid();
        public string ExeptionType { get; set; } = string.Empty;
        public HttpStatusCode StatusCode { get; set; }
        public string Message { get; set; } = string.Empty;
        public  DateTime DateError { get; set; } = new DateTime();
        public int UserId { get; set; } = 0;
        public string? UserName { get; set; } = string.Empty;
        public string? StackTrace { get; set; } = string.Empty;

        public override string ToString()
        {
            return JsonSerializer.Serialize(this);
        }
    }
}
