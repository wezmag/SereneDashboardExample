using System;

namespace DashboardSample.Common
{
    public static class TimeRangeHelper
    {
        public static DateTime GetStartDate(DateTime endDate, TimeRange timeRange)
        {
            DateTime startDate = endDate;
            switch (timeRange)
            {
                case TimeRange.Last30Days:
                    startDate = endDate.AddDays(-30).Date;
                    break;
                case TimeRange.Last3Months:
                    startDate = endDate.AddMonths(-3).Date;
                    break;
                case TimeRange.Last6Months:
                    startDate = endDate.AddMonths(-6).Date;
                    break;
                case TimeRange.Last12Months:
                    startDate = endDate.AddMonths(-12).Date;
                    break;
            }
            return startDate;
        }
    }
}
