import { Decorators, EnumEditor, TemplatedWidget } from "@serenity-is/corelib";
import { TimeRange } from "../../../ServerTypes/Common/TimeRange";
import { Chart, ChartDataset } from 'chart.js/auto';
import { format } from "@serenity-is/corelib/q";
import { ChartDataSet, SalesByCategoryStackedWidgetService } from "../../../ServerTypes/Common";
import { randomColor } from 'randomcolor';

@Decorators.registerClass('DashboardSample.Common.SalesByCategoryStackedWidget')
export class SalesByCategoryStackedWidget extends TemplatedWidget<any>
{
    private timeSelect: EnumEditor;
    private myChart: Chart;
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
                type: 'bar',
                data: null,
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    layout: { padding: 10 },
                    scales: {
                        y: {
                            stacked: true,
                            beginAtZero: true,

                        },
                        x: {
                            stacked: true
                        }
                    },
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            mode: 'index',
                            filter: (e) => e.raw !== 0,
                            callbacks: {
                                footer: items => {
                                    let total = items.reduce((s, a) => s + Number(a.raw), 0);
                                    return format('Total: {0}', total);
                                }
                            }
                        }
                    }
                }
            });
        }
    }

    private populateData(): void {
        SalesByCategoryStackedWidgetService.GetResponse({
            TimeRange: Number(this.timeSelect.value)
        }, response => {
            const categorySales = response.CategorySales;
            const labels = Object.keys(categorySales).map(k => k);
            let colorCount = Object.keys(categorySales).reduce((sum, key) => {
                const values = categorySales[key] as ChartDataSet[];
                return sum + values.length
            }, 0);
            const colors = new randomColor({ luminosity: 'light', count: colorCount });
            const datasets: ChartDataset[] = [];
            Object.keys(categorySales).map(k => {
                const values = categorySales[k] as ChartDataSet[];
                values.map(v => {
                    colorCount--;
                    datasets.push({
                        label: v.Label,
                        data: v.Datas,
                        barPercentage: 0.5,
                        backgroundColor: colors[colorCount]
                    })
                });
            });
            this.myChart.data = {
                labels: labels,
                datasets: datasets
            };
            this.myChart.update();
        });
    }
}