using Microsoft.AspNetCore.Mvc;
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
        public StatisticsWidgetResponse GetStatistics(IDbConnection connection, TimeRangeRequest request,
            [FromServices] ITwoLevelCache cache)
        {
            if (request is null)
                throw new ArgumentNullException(nameof(request));

            if (!request.TimeRange.HasValue)
                throw new ArgumentNullException(nameof(request.TimeRange));

            //The date of the lastest order is 2022-12-16 in the sample database, so we use that as end date.
            //In real world, you need to use DateTime.Now.Date.
            var endDate = new DateTime(2022, 12, 16);
            var startDate = TimeRangeHelper.GetStartDate(endDate, request.TimeRange.Value);
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

    public class StatisticsWidgetResponse : ServiceResponse
    {
        public int OpenOrder { get; set; }
        public int ClosedOrder { get; set; }
    }
}
