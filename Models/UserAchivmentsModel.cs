namespace NovelProject.Models
{
    public class UserAchivmentsModel
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int AchivmentId { get; set; }
        public bool IsAchieved { get; set; } = false;
        public DateTime AchievedAt { get; set; } = DateTime.MinValue;
    }
}
