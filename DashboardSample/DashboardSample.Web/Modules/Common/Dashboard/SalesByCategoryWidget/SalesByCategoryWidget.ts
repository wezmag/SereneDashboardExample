import { Decorators, EnumEditor, TemplatedWidget } from "@serenity-is/corelib";
import { TimeRange } from "../../../ServerTypes/Common/TimeRange";
import { Chart } from 'chart.js/auto';
import { SalesByCategoryWidgetService } from "../../../ServerTypes/Common";
import { randomColor } from 'randomcolor';

@Decorators.registerClass('DashboardSample.Common.SalesByCategoryWidget')
export class SalesByCategoryWidget extends TemplatedWidget<any> {
    private myChart: Chart;
    private timeSelect: EnumEditor;
    constructor(container: JQuery) {
        super(container);

        this.initTimeSelect();
        this.initChart();
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

    private initChart(): void {
        if (this.myChart === undefined) {
            this.myChart = new Chart(this.byId('ChartCanvas')[0] as HTMLCanvasElement, {
                data: null,
                type: 'bar',
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    layout: { padding: 10 },
                    scales: {
                        x: {
                            ticks: {
                                autoSkip: false
                            }
                        }
                    },
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            callbacks: {
                                label: (item) => {
                                    let label = item.dataset.label || '';

                                    if (label) {
                                        label += ': ';
                                    }
                                    if (item.parsed.y !== null) {
                                        label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(item.parsed.y);
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
        SalesByCategoryWidgetService.GetResponse({
            TimeRange: Number(this.timeSelect.value)
        }, response => {
          
            this.myChart.data = {
                labels: response.ChartPoints.map(v => v.Label),
                datasets: [{
                    data: response.ChartPoints.map(v => v.Data),
                    backgroundColor: randomColor({ luminosity: 'light' }),
                    barPercentage: 0.5
                }]
            };

            this.myChart.update();

        })
    }
}