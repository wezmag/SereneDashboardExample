using Serenity.Services;

namespace DashboardSample.Common
{
    public class TimeRangeRequest : ServiceRequest
    {
        public TimeRange? TimeRange { get; set; }
    }
}
