import { Decorators, TemplatedWidget } from "@serenity-is/corelib";

$(() => {
    new DashboardPage($('#DashboardDiv')).init();
})

@Decorators.registerClass('DashboardSample.Common.DashboardPage')
export class DashboardPage extends TemplatedWidget<any> {
    constructor(container: JQuery) {
        super(container);
    }
}