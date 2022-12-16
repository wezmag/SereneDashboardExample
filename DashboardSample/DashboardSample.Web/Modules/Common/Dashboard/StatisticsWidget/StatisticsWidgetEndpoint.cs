using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Formatters;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Serenity;
using Serenity.Abstractions;
using Serenity.Data;
using Serenity.Demo.Northwind;
using Serenity.Services;
using System;
using System.Data;

namespace DashboardSample.Common
{
    [Route("Services/Common/StatisticsWidget/[action]")]
    [ConnectionKey(typeof(OrderRow))]
    public class StatisticsWidgetController : ServiceEndpoint
    {
        public StatisticsWidgetResponse GetStatistics(IDbConnection connection, StatisticsWidgetRequest request,
            [FromServices] ITwoLevelCache cache)
        {
            if (request is null)
                throw new ArgumentNullException(nameof(request));

            if (!request.TimeRange.HasValue)
                throw new ArgumentNullException(nameof(request.TimeRange));

            //The date of the last order is 2022-12-16 in the sample database, so we use that as end date.
            //In real world, you need to use DateTime.Now.Date.
            var endDate = new DateTime(2022, 12, 16);
            //var endDate = DateTime.Now.Date;
            DateTime startDate = endDate;
            switch (request.TimeRange)
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

            var o = OrderRow.Fields;
            return cache.GetLocalStoreOnly($"StatisticsWidget.GetResponse.{request.TimeRange}",
                TimeSpan.FromMinutes(5),
                o.GenerationKey,
                () =>
                {
                    return new StatisticsWidgetResponse()
                    {
                        OpenOrder = connection.Count<OrderRow>(
                            new Criteria(o.ShippingState) == OrderShippingState.NotShipped &&
                            new Criteria(o.OrderDate) <= endDate &&
                            new Criteria(o.OrderDate) >= startDate),
                        ClosedOrder = connection.Count<OrderRow>(
                            new Criteria(o.ShippingState) == OrderShippingState.Shipped &&
                            new Criteria(o.OrderDate) <= endDate &&
                            new Criteria(o.OrderDate) >= startDate)
                    };
                });
        }
    }

    public class StatisticsWidgetRequest : ServiceRequest
    {
        public TimeRange? TimeRange { get; set; }
    }

    public class StatisticsWidgetResponse : ServiceResponse
    {
        public int OpenOrder { get; set; }
        public int ClosedOrder { get; set; }
    }
}
