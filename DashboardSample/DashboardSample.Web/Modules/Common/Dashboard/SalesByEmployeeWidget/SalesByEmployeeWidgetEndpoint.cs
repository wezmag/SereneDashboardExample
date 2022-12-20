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
    [Route("Services/Common/SalesByEmployeeWidget/[action]")]
    [ConnectionKey(typeof(OrderRow))]
    public class SalesByEmployeeWidgetController : ServiceEndpoint
    {
        [HttpPost]
        public ServiceResponse GetMonthSelect(IDbConnection connection, ServiceRequest request)
        {
            var sql = @"
SELECT DISTINCT LEFT(CONVERT(NVARCHAR, OrderDate, 23), 7) AS MonthSelect
FROM Orders AS o
ORDER BY LEFT(CONVERT(NVARCHAR, OrderDate, 23), 7) DESC";
            var monthSelects = connection.Query<string>(sql).ToList();
            return new ServiceResponse {
                CustomData = new Dictionary<string, object> {
                    { "MonthSelects", monthSelects }
                }
            };
        }

        [HttpPost]
        public SalesByEmployeeResponse GetResponse(IDbConnection connection, SalesByEmployeeRequest request)
        {
            if (request is null)
                throw new ArgumentNullException(nameof(request));

            var sql = new StringBuilder(@"
SELECT CONCAT(e.FirstName, ' ', e.LastName) AS Label, ISNULL(s.Sales, 0) AS Data
FROM Employees e
LEFT JOIN (
SELECT e.EmployeeID, SUM(ode.ExtendedPrice) AS Sales
FROM [Order Details Extended] ode
LEFT JOIN Orders o ON o.OrderID = ode.OrderID
LEFT JOIN Employees e ON e.EmployeeID = o.EmployeeID
WHERE o.ShippedDate IS NOT NULL");
            if (!string.IsNullOrWhiteSpace(request.SelectMonth))
            {
                sql.Append(@"
AND LEFT(CONVERT(NVARCHAR, OrderDate, 23), 7) = @SelectMonth");
            }
            sql.Append(@"
GROUP BY e.EmployeeID) AS s ON s.EmployeeID = e.EmployeeID
ORDER BY Sales DESC");

            return new SalesByEmployeeResponse
            {
                ChartPoints = connection.Query<ChartPoint>(sql.ToString(), new { request.SelectMonth }).ToList()
            };
        }
    }

    public class SalesByEmployeeResponse : ServiceResponse
    {
        public List<ChartPoint> ChartPoints { get; set; }
    }

    public class SalesByEmployeeRequest : ServiceRequest
    {
        public string SelectMonth { get; set; }
    }
}
