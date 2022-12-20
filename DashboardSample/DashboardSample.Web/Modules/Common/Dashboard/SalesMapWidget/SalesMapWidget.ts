import { Decorators, Select2Editor, Select2EditorOptions, TemplatedWidget } from "@serenity-is/corelib";
import { format, tryFirst } from "@serenity-is/corelib/q";
import Chart from 'chart.js/auto';
import * as ChartGeo from 'chartjs-chart-geo';
import { ChoroplethChart } from 'chartjs-chart-geo';
import { SalesByEmployeeWidgetService } from "../../../ServerTypes/Common/SalesByEmployeeWidgetService";
import { SalesMapWidgetService } from "../../../ServerTypes/Common/SalesMapWidgetService";

@Decorators.registerClass('DashboardSample.Common.SalesMapWidget')
export class SalesMapWidget extends TemplatedWidget<any> {
    private monthSelect: Select2Editor<any, any>;
    private countries: any[];
    private myChart: Chart;

    constructor(container: JQuery) {
        super(container);

        this.initMonthSelect();
        this.initChart();
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
            fetch('https://unpkg.com/world-atlas/countries-50m.json').then(r => r.json()).then(data => {
                this.countries = ChartGeo.topojson.feature(data, data.objects.countries)['features'];
                const ctx = this.byId('ChartCanvas')[0] as HTMLCanvasElement;
                this.myChart = new ChoroplethChart(ctx, {
                    data: null,
                    options: {
                        showOutline: true,
                        showGraticule: true,
                        scales: {
                            projection: {
                                axis: 'x',
                                projection: 'equalEarth',
                                beginAtZero: true
                            }
                        },
                        plugins: {
                            legend: { display: false },
                            tooltip: {
                                callbacks: {
                                    label: (item) => {
                                        const d = item.dataset.data[item.dataIndex];
                                        return format('{0}: {1}', d.feature.properties.name, new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(d.value));
                                    }
                                }
                            }
                        }
                    }
                });
                this.populateData();
            });
        }
    }

    /**
    * Convert the country name to match the name in the Northwind database.
    * eg: United State of America -> USA, United Kingdom -> UK
    */
    private getCountryName(name: string): string {
        switch (name) {
            case 'United States of America':
                return 'USA';
            case 'United Kingdom':
                return 'UK';
            default:
                return name;
        }
    }

    private populateData(): void {
        SalesMapWidgetService.GetResponse({
            SelectMonth: this.monthSelect.value
        }, response => {
            this.myChart.data = {
                labels: this.countries.map(d => d.properties.name),
                datasets: [{
                    label: 'Countries',
                    data: this.countries.map(d => {
                        const countryName = this.getCountryName(d.properties.name);
                        const cp = tryFirst(response.ChartPoints, c => c.Label === countryName);
                        return { feature: d, value: cp == null ? 0 : cp.Data };
                    })
                }]
            };
            this.myChart.update();
        });
    }
}