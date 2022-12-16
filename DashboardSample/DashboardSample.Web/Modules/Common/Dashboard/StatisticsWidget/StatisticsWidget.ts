import { Decorators, EnumEditor, TemplatedWidget } from "@serenity-is/corelib";
import { StatisticsWidgetService } from "../../../ServerTypes/Common";
import { TimeRange } from "../../../ServerTypes/Common/TimeRange";

@Decorators.registerClass('DashboardSample.Common.StatisticsWidget')
export class StatisticsWidget extends TemplatedWidget<any> {
    private timeSelect: EnumEditor;

    constructor(container: JQuery) {
        super(container);

        this.initTimeSelect();
        this.populateData();
    }

    private initTimeSelect(): void {
        this.timeSelect = new EnumEditor(this.byId('TimeSelect'), {
            allowClear: false,
            enumKey: 'Common.TimeRange'
        });
        this.timeSelect.value = TimeRange.Last3Months.toString();
        this.timeSelect.change(() => this.populateData());
    }

    private populateData(): void {
        StatisticsWidgetService.GetStatistics({
            TimeRange: Number(this.timeSelect.value)
        }, response => {
            const totalOrder = response.ClosedOrder + response.OpenOrder;
            const closeRate = Math.round(response.ClosedOrder / totalOrder * 100);
            this.byId('ClosedOrder').text(response.ClosedOrder);
            this.byId('OpenOrder').text(response.OpenOrder);
            this.byId('TotalOrder').text(totalOrder);
            this.byId('CloseRateOrder').text(closeRate);
        })
    }
}