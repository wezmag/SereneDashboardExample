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
    [Route("Services/Common/SalesMapWidget/[action]")]
    [ConnectionKey(typeof(OrderRow))]
    public class SalesMapWidgetController : ServiceEndpoint
    {
        public SalesMapWidgetResponse GetResponse(IDbConnection connection, SalesMapWidgetRequest request)
        {
            if (request is null)
                throw new ArgumentNullException(nameof(request));

            var sql = new StringBuilder(@"
SELECT ShipCountry AS Label, SUM(ode.ExtendedPrice) AS Data
FROM [Order Details Extended] ode
LEFT JOIN Orders o ON o.OrderID = ode.OrderID
WHERE o.ShippedDate IS NOT NULL");
            if (!string.IsNullOrWhiteSpace(request.SelectMonth))
            {
                sql.Append(@"
AND LEFT(CONVERT(NVARCHAR, o.OrderDate, 23), 7) = @SelectMonth");
            }
            sql.Append(@"
GROUP BY ShipCountry");
            return new SalesMapWidgetResponse
            {
                ChartPoints = connection.Query<ChartPoint>(sql.ToString(), new { request.SelectMonth }).ToList()
            };
        }
    }

    public class SalesMapWidgetResponse : ServiceResponse
    {
        public List<ChartPoint> ChartPoints { get; set; }
    }

    public class SalesMapWidgetRequest : ServiceRequest
    {
        public string SelectMonth { get; set; }
    }
}
