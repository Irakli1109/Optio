import { AfterContentInit, Component, OnInit } from '@angular/core';
import { EChartsOption } from 'echarts';
import { AnalyticsService } from '../services/analytics.service';
import { DashboardService } from '../services/dashboard.service';
import * as echarts from 'echarts';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterContentInit {

  GeoGdp: number = 0;
  total: number = 0;
  world: number = 0;
  others: number = 0;
  years: Number[] = [];
  gdpByYears: number[] = [];
  countries: string[] = [];
  countryCodes: string[] = [];
  array: number[] = [];
  myChart: any;

  map1:Map<any, any> = new Map();
  constructor(public dashboardService: DashboardService) {
    this.dashboardService.getData("GEO", 2020).subscribe(data=>{
      //console.log(data[1]);
      this.GeoGdp = data[1][0].value;
    });
    this.dashboardService.getData("all", 2020).subscribe(data=>{
        for(let i=49; i<=265; i++){
          this.total+=data[1][i].value;
          if(data[1][i].value!=null){
            this.array.push((data[1][i].value));
            this.countries.push(data[1][i].country.value);
            this.countryCodes.push(data[1][i].countryiso3code);
          }
        }
        this.world = data[1][48].value; //world value
        this.array.sort(function(a, b) { return a < b ? 1 : -1}); //descending  order
        this.others = this.total;
        for(let i=0; i<10; i++){
          this.others-=this.array[i];
        }
        for(let i=1980; i<2021; i++)
        this.years.push(i);
    })
  }

  ngOnInit(): void {
    this.getAPIResult();

    setTimeout(()=>{
      type EChartsOption = echarts.EChartsOption;

    var chartDom = document.getElementById('main')!;
    var myChart = echarts.init(chartDom, 'dark');
    var piChartOption: EChartsOption;

    piChartOption = {
      title: {
        text: 'GDP of Top 10 Countires',
        subtext: 'World Bank',
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          name: 'Access From',
          type: 'pie',
          radius: '50%',
          data: [
            { value: this.array[0], name: this.map1.get(this.array[0]) },
            { value: this.array[1], name: this.map1.get(this.array[1]) },
            { value: this.array[2], name: this.map1.get(this.array[2]) },
            { value: this.array[3], name: this.map1.get(this.array[3]) },
            { value: this.array[4], name: this.map1.get(this.array[4]) },
            { value: this.array[5], name: this.map1.get(this.array[5]) },
            { value: this.array[6], name: this.map1.get(this.array[6]) },
            { value: this.array[7], name: this.map1.get(this.array[7]) },
            { value: this.array[8], name: this.map1.get(this.array[8]) },
            { value: this.array[9], name: this.map1.get(this.array[9]) },
            { value: this.others, name: "Others" },
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 20,
              shadowOffsetX: 0,
              shadowColor: 'rgba(2, 0, 0, 0.5)'
            }
          }
        }
      ]
    };

    piChartOption && myChart.setOption(piChartOption);
    },100)
  }
  ngAfterContentInit(){

  }

  getAPIResult(){
    this.dashboardService.getData("all", 2020).subscribe(data=>{
      for(let i=49; i<=265; i++){
        //console.log(data[1][i].country.value+data[1][i].value);
        if(data[1][i].value!=null)
        this.map1.set((data[1][i].value), data[1][i].country.value);
      }

    });
  }

  drawLine(){

var chartDom = document.getElementById('second')!;

this.myChart = echarts.init(chartDom, 'dark');
var option;


option = {
  xAxis: {
    type: 'category',
    data: this.years
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      data: this.gdpByYears,
      type: 'line'
    }
  ]
};

option && this.myChart.setOption(option);


  }

  selectedChange(event: any){
    this.gdpByYears = []; //empty array
    this.dashboardService.getByYear(event.target.value).subscribe(data=>{
      for(let i=0; i<=2020-1981; i++){
        this.gdpByYears.unshift(data[1][i].value);
      }
    })
    setTimeout(() => {
      if(this.myChart!=null||this.myChart!='')
        this.myChart = null;
      this.drawLine();
    }, 300);
  }
}
