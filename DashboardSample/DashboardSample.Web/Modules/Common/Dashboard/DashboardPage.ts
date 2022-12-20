import { Decorators, TemplatedWidget } from "@serenity-is/corelib";
import { SalesByCategoryStackedWidget } from "./SalesByCategoryStackedWidget/SalesByCategoryStackedWidget";
import { SalesByCategoryWidget } from "./SalesByCategoryWidget/SalesByCategoryWidget";
import { SalesByEmployeeWidget } from "./SalesByEmployeeWidget/SalesByEmployeeWidget";
import { SalesMapWidget } from "./SalesMapWidget/SalesMapWidget";
import { StatisticsWidget } from "./StatisticsWidget/StatisticsWidget";

$(() => {
    new DashboardPage($('#DashboardDiv')).init();
})

@Decorators.registerClass('DashboardSample.Common.DashboardPage')
export class DashboardPage extends TemplatedWidget<any> {
    constructor(container: JQuery) {
        super(container);

        new StatisticsWidget(this.byId('StatisticsWidget')).init();
        new SalesByCategoryWidget(this.byId('ChartAreaRight1')).init();
        new SalesByCategoryStackedWidget(this.byId('ChartAreaRight2')).init();

        new SalesByEmployeeWidget(this.byId('ChartAreaLeft1')).init();
        new SalesMapWidget(this.byId('ChartAreaLeft2')).init();
    }
}