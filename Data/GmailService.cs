namespace NovelProject.Data
{
    public class GmailService
    {
        private readonly ILogger<GmailService> logger;
        public GmailService(ILogger<GmailService> logger)
        {
            this.logger = logger;
        }
        public void SendEmailDefault()
        {
            try
            {
                logger.LogInformation("Send email sucsusfully");
            }
            catch (Exception ex)
            {
                logger.LogError(ex.GetBaseException().Message);
            }
        }
        public void SendEmailCustom()
        {
            try
            {
                logger.LogInformation("Send email sucsusfully");
            }
            catch (Exception ex)
            {
                logger.LogError(ex.GetBaseException().Message);
            }
        }
    }
}
