using System.Collections.Generic;

namespace DashboardSample.Common.Chart
{
    public class ChartPoint
    {
        public string Label { get; set; }
        public decimal Data { get; set; }
    }

    public class ChartDataSet
    {
        public string Label { get; set; }
        public decimal[] Datas { get; set; }
    }
}
