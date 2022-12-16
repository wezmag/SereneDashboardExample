using DashboardSample.Common.Chart;
using FluentMigrator.Runner.Generators.Redshift;
using Microsoft.AspNetCore.Mvc;
using Serenity;
using Serenity.Abstractions;
using Serenity.Data;
using Serenity.Demo.Northwind;
using Serenity.Services;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DashboardSample.Common
{
    [Route("Services/Common/SalesByCategoryWidget/[action]")]
    [ConnectionKey(typeof(OrderRow))]
    public class SalesByCategoryWidgetController : ServiceEndpoint
    {
        public SalesByCategoryWidgetResponse GetResponse(IDbConnection connection, TimeRangeRequest request,
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
            var sql = @"
SELECT c.CategoryName AS Label, ISNULL(s.Sales, 0) AS Value
FROM Categories c
LEFT JOIN (
SELECT c.CategoryID, SUM(od.ExtendedPrice) AS Sales
FROM [Order Details Extended] od
LEFT JOIN Orders o ON o.OrderID = od.OrderID
LEFT JOIN Products p ON p.ProductID = od.ProductID
LEFT JOIN Categories c ON c.CategoryID = p.CategoryID
WHERE o.ShippedDate IS NOT NULL
AND o.OrderDate BETWEEN @startDate AND @endDate
GROUP BY c.CategoryID) s ON s.CategoryID = c.CategoryID";

            return cache.GetLocalStoreOnly($"SalesByCategoryWidget.GetResponse.{request.TimeRange}",
                TimeSpan.FromMinutes(5),
                OrderRow.Fields.GenerationKey,
                () =>
                {
                    return new SalesByCategoryWidgetResponse
                    {
                        ChartPoints = connection.Query<ChartPoint>(sql, new { startDate, endDate }).ToList()
                    };
                });
        }
    }

    public class SalesByCategoryWidgetResponse : ServiceResponse
    {
        public List<ChartPoint> ChartPoints { get; set; }
    }
}
