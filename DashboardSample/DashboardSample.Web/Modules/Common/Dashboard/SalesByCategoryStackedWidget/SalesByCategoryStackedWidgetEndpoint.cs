using DashboardSample.Common.Chart;
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

namespace DashboardSample.Common
{
    [Route("Services/Common/SalesByCategoryStackedWidget/[action]")]
    [ConnectionKey("Northwind")]
    public class SalesByCategoryStackedWidgetController : ServiceEndpoint
    {
        [HttpPost]
        public SalesByCategoryStackedWidgetResponse GetResponse(IDbConnection connection, TimeRangeRequest request,
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
SELECT c.CategoryName, p.ProductName, ISNULL(Sales, 0) AS Sales
FROM Products p
LEFT JOIN (
	SELECT p.ProductID, SUM(od.ExtendedPrice) AS Sales
	FROM [Order Details Extended] od
	LEFT JOIN Orders o ON o.OrderID = od.OrderID
	LEFT JOIN Products p ON p.ProductID = od.ProductID
	WHERE o.ShippedDate IS NOT NULL 
	AND o.OrderDate BETWEEN @startDate AND @endDate
	GROUP BY p.ProductID) ps ON p.ProductID = ps.ProductID
LEFT JOIN Categories c ON p.CategoryID = c.CategoryID
WHERE Sales IS NOT NULL
ORDER BY c.CategoryName, p.ProductName";
            var salesRawData = connection.Query<ProductSales>(sql, new { startDate, endDate });
            var categoryList = salesRawData.Select(c => c.CategoryName).Distinct().ToList();

            var categorySales = categoryList.ToDictionary(c => c, c => new List<ChartDataSet>());
            foreach (var row in salesRawData)
            {
                int index = categoryList.FindIndex(c => c == row.CategoryName);
                var datas = new decimal[categoryList.Count()];
                datas[index] = row.Sales;
                categorySales[row.CategoryName].Add(new ChartDataSet
                {
                    Label = row.ProductName.ToString(),
                    Datas = datas
                });
            }
            return cache.GetLocalStoreOnly($"SalesByCategoryStackedWidget.GetResponse.{request.TimeRange}",
                TimeSpan.FromMinutes(5),
                OrderRow.Fields.GenerationKey,
                () =>
                {
                    return new SalesByCategoryStackedWidgetResponse()
                    {
                        CategorySales = categorySales
                    };
                });
        }
        private class ProductSales
        {
            public string CategoryName { get; set; }
            public string ProductName { get; set; }
            public decimal Sales { get; set; }
        }
    }

    public class SalesByCategoryStackedWidgetResponse : ServiceResponse
    {
        public Dictionary<string, List<ChartDataSet>> CategorySales { get; set; }
    }
}
