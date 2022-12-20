import { Decorators, TemplatedWidget } from "@serenity-is/corelib";
import { SalesByCategoryStackedWidget } from "./SalesByCategoryStackedWidget/SalesByCategoryStackedWidget";
import { SalesByCategoryWidget } from "./SalesByCategoryWidget/SalesByCategoryWidget";
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
    }
}