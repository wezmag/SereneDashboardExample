using DashboardSample.Common.Chart;
using Microsoft.AspNetCore.Mvc;
using Serenity.Data;
using Serenity.Demo.Northwind;
using Serenity.Services;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;

namespace DashboardSample.Common
{
    [Route("Services/Common/SalesByCategoryPieWidget/[action]")]
    [ConnectionKey(typeof(OrderRow))]
    public class SalesByCategoryPieWidgetController : ServiceEndpoint
    {
        [HttpPost]
        
        public SalesByCategoryPieWidgetResponse GetResponse(IDbConnection connection, SalesByCategoryPieWidgetRequest request)
        {
            if (request is null)
                throw new ArgumentNullException(nameof(request));

            var endDate = new DateTime(2022, 12, 16);
            var startDate = request.TimeRange.HasValue ? TimeRangeHelper.GetStartDate(endDate, request.TimeRange.Value) : endDate;

            var sql = new StringBuilder();
            if (request.CategoryId <= 0)
                sql.Append(@"
SELECT c.CategoryID, c.CategoryName AS Label, SUM(ode.ExtendedPrice) AS Data");
            else
                sql.Append(@"
SELECT p.ProductID, p.ProductName AS Label, SUM(ode.ExtendedPrice) AS Data");

            sql.Append(@"
FROM [Order Details Extended] ode
LEFT JOIN Orders o ON o.OrderID = ode.OrderID
LEFT JOIN Products p ON p.ProductID = ode.ProductID");

            if (request.CategoryId <= 0)
                sql.Append(@"
LEFT JOIN Categories c ON c.CategoryID = p.CategoryID
WHERE 1 = 1");
            else
                sql.Append(@"
WHERE p.CategoryID = @CategoryId");

            sql.Append(@"
AND o.ShippedDate IS NOT NULL");

            if (startDate != endDate)
                sql.Append(@"
AND o.OrderDate BETWEEN @startDate AND @endDate");

            if (request.CategoryId <= 0)
                sql.Append(@"
GROUP BY c.CategoryID, c.CategoryName");
            else
                sql.Append(@"
GROUP BY p.ProductID, p.ProductName");


            return new SalesByCategoryPieWidgetResponse
            {
                Points = connection.Query<ChartPoint>(sql.ToString(), new { request.CategoryId, startDate, endDate }).ToList()
            };
        }
    }

    public class SalesByCategoryPieWidgetResponse : ServiceResponse
    {
        public List<ChartPoint> Points { get; set; }
    }

    public class SalesByCategoryPieWidgetRequest : ServiceRequest
    {
        public int CategoryId { get; set; }
        public TimeRange? TimeRange { get; set; }
    }
}
