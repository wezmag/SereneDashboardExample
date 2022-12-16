import { Decorators, TemplatedWidget } from "@serenity-is/corelib";
import { StatisticsWidget } from "./StatisticsWidget/StatisticsWidget";

$(() => {
    new DashboardPage($('#DashboardDiv')).init();
})

@Decorators.registerClass('DashboardSample.Common.DashboardPage')
export class DashboardPage extends TemplatedWidget<any> {
    constructor(container: JQuery) {
        super(container);

        new StatisticsWidget(this.byId('StatisticsWidget')).init();
    }
}