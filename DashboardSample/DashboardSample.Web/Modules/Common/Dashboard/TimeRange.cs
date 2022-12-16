using Serenity.ComponentModel;
using System.ComponentModel;

namespace DashboardSample.Common
{
    [EnumKey("Common.TimeRange")]
    public enum TimeRange
    {
        [Description("Last 30 days")]
        Last30Days = 0,
        [Description("Last 3 months")]
        Last3Months = 1,
        [Description("Last 6 months")]
        Last6Months = 2,
        [Description("Last 12 months")]
        Last12Months = 3
    }
}
