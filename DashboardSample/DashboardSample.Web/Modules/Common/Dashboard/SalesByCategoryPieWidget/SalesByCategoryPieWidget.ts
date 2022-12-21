import { Decorators, LookupEditor, TemplatedWidget, LookupEditorOptions, EnumEditor, EnumEditorOptions } from "@serenity-is/corelib";
import Chart from 'chart.js/auto';
import { SalesByCategoryPieWidgetRequest } from "../../../ServerTypes/Common/SalesByCategoryPieWidgetRequest";
import { SalesByCategoryPieWidgetService } from "../../../ServerTypes/Common/SalesByCategoryPieWidgetService";
import { randomColor } from 'randomcolor';

@Decorators.registerClass('DashboardSample.Common.SalesByCategoryPieWidget')
export class SalesByCategoryPieWidget extends TemplatedWidget<any> {
    private myChart: Chart;
    private categorySelect: LookupEditor;
    private timeSelect: EnumEditor;

    constructor(container: JQuery) {
        super(container);
         
        this.initTimeSelect();
        this.initCategorySelect();
        this.initChart();
        this.populateData();
    }

    private initTimeSelect(): void {
        this.timeSelect = new EnumEditor(this.byId('TimeSelect'), {
            enumKey: 'Common.TimeRange'
        });
        this.timeSelect.change(() => this.populateData());
    }

    private initCategorySelect(): void {
        this.categorySelect = new LookupEditor(this.byId('CategorySelect'), <LookupEditorOptions>{
            lookupKey: 'Northwind.Category'
        });
        this.categorySelect.change(() => this.populateData());
    }

    private initChart(): void {
        if (this.myChart === undefined) {
            const ctx = this.byId('ChartCanvas')[0] as HTMLCanvasElement;
            this.myChart = new Chart(ctx, {
                type: 'pie',
                data: null,
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    layout: { padding: 20 },
                    plugins: {
                        legend: { display: false }
                    }
                }
            });
        }
    }

    private populateData(): void {
        console.log(this.timeSelect.value);
        SalesByCategoryPieWidgetService.GetResponse(<SalesByCategoryPieWidgetRequest>{
            CategoryId: Number(this.categorySelect.value),
            TimeRange: this.timeSelect.value == '' ? null : Number(this.timeSelect.value)
        }, response => {
            var colors = new randomColor({ luminosity: 'light', count: response.Points.length });
            this.myChart.data = {
                labels: response.Points.map(c => c.Label),
                datasets: [{
                    data: response.Points.map(c => c.Data),
                    backgroundColor: colors
                }]
            };
            this.myChart.update();
        });
    }
}