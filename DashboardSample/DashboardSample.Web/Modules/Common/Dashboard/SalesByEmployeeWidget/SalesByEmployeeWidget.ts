import { Decorators, Select2Editor, Select2EditorOptions, TemplatedWidget } from "@serenity-is/corelib";
import Chart from "chart.js/auto";
import { SalesByEmployeeWidgetService } from "../../../ServerTypes/Common/SalesByEmployeeWidgetService";

@Decorators.registerClass('DashboardSample.Common.SalesByEmployeeWidget')
export class SalesByEmployeeWidget extends TemplatedWidget<any> {
    private monthSelect: Select2Editor<any, any>;
    private myChart: Chart;

    constructor(container: JQuery) {
        super(container);

        this.initMonthSelect();
        this.initChart();
        this.populateData();
    }

    private initMonthSelect(): void {
        this.monthSelect = new Select2Editor(this.byId('MonthSelect'), <Select2EditorOptions>{
            allowClear: true
        });

        SalesByEmployeeWidgetService.GetMonthSelect({}, response => {
            const selectItems = response['CustomData']['MonthSelects'] as string[];
            this.monthSelect.clearItems();
            selectItems.forEach(v => this.monthSelect.addItem({ id: v, text: v }));
            this.monthSelect.value = '';
        });

        this.monthSelect.change(() => this.populateData());
    }

    private initChart(): void {
        if (this.myChart === undefined) {
            const ctx = this.byId('ChartCanvas')[0] as HTMLCanvasElement;
            this.myChart = new Chart(ctx, {
                type: 'bar',
                data: null,
                options: {
                    indexAxis: 'y',
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            callbacks: {
                                label: (item) => {
                                    let label = item.dataset.label || '';

                                    if (label) {
                                        label += ': ';
                                    }
                                    if (item.parsed.x !== null) {
                                        label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(item.parsed.x);
                                    }
                                    return label;
                                },
                            }
                        }
                    }
                }
            });
        }
    }

    private populateData(): void {
        SalesByEmployeeWidgetService.GetResponse(
            {
                SelectMonth: this.monthSelect.value
            },
            response => {
                this.myChart.data = {
                    labels: response.ChartPoints.map(v => v.Label),
                    datasets: [{
                        data: response.ChartPoints.map(v => v.Data),
                        barPercentage: 0.5
                    }]
                };
                this.myChart.update();
            }
        );
    }

}