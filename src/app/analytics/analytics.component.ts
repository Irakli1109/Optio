import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from '../services/analytics.service';
import * as echarts from 'echarts';
@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss']
})
export class AnalyticsComponent implements OnInit {
  option: any;
  chartDom: any;
  myChart: any;
  countries: string[] = [];
  countryCodes: string[] =[];
  chosenCountries: string[] = ['Georgia', 'Russian Federation', 'Turkey', 'Armenia', 'Azerbaijan'];
  counter: number = 5;
  countrySeries: any = [
    {
      name: 'Georgia',
      type: 'line',
      data: this.contryValuesByYears('GEO', 1980, 2020),
      smooth: true
    },
    {
      name: 'Russian Federation',
      type: 'line',
      data: this.contryValuesByYears('RUS', 1980, 2020),
      smooth: true
    },
    {
      name: 'Turkey',
      type: 'line',
      data: this.contryValuesByYears('TUR', 1980, 2020),
      smooth: true
    },
    {
      name: 'Armenia',
      type: 'line',
      data: this.contryValuesByYears('ARM', 1980, 2020),
      smooth: true
    },
    {
      name: 'Azerbaijan',
      type: 'line',
      data: this.contryValuesByYears('AZE', 1980, 2020),
      smooth: true
    },
  ]
  map1:Map<string, string> = new Map();
  map2:Map<string, string> = new Map();
  constructor(public analytics: AnalyticsService){}

  ngOnInit(): void {
    this.chartDom = document.getElementById('main')!;
    this.myChart = echarts.init(this.chartDom, 'dark')
    this.option = {
      title: {
        text: 'GDP By Years'
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: this.chosenCountries,
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      toolbox: {
        feature: {
          saveAsImage: {}
        }
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: this.analytics.yearFilter(),
      },
      yAxis: {
        type: 'value'
      },
      series: this.countrySeries
    };
    setTimeout(()=>{
      this.option && this.myChart.setOption(this.option);
    }, 1500)
    this.countryList();
  }

  filter(val1: any=1980, val2: any=2020){
    if(val1.value>=1980 && val2.value<=2020 && val1.value<=val2.value){
      this.option.xAxis.data = this.analytics.yearFilter(val1.value, val2.value)
      for(let i=0; i<this.countrySeries.length; i++){
        this.countrySeries[i].data = this.contryValuesByYears(this.map2.get(this.countrySeries[i].name)!, val1.value, val2.value);
      }
      setTimeout(()=>{
        this.option && this.myChart.setOption(this.option);
      }, 1000)
    }
  }

  countryList(){
    this.analytics.getCountries().subscribe(data=>{
      for(let i=49; i<=265; i++){
        this.countries.push(data[1][i].country.value);
        this.countryCodes.push(data[1][i].countryiso3code);
        this.map1.set(data[1][i].countryiso3code, data[1][i].country.value);
        this.map2.set(data[1][i].country.value, data[1][i].countryiso3code);
      }
    })
    //console.log(this.map1)
  }
  contryValuesByYears(countryCode: string, start: number=1980, end: number=2020): number[]{
    let values: number[] = [];
    for(let i=start; i<=end; i++){
      this.analytics.getData(countryCode, i).subscribe(data=>{
        values.push(data[1][0].value)
      })
    }
    return values;
  }

  selectedChange(event: any){
    /* //console.log(event.target.value)
    this.countrySeries.push({
      name: this.map1.get(event.target.value),
      type: 'line',
      data: this.contryValuesByYears(event.target.value, 1980, 2020),
      smooth: true
    })
    this.chosenCountries.push(this.map1.get(event.target.value) as string)
    setTimeout(()=>{
      this.option && this.myChart.setOption(this.option);
    }, 1000)
    //console.log(this.map1.get(event.target.value)) */
  }

  add(event: any){
    if(this.counter<10){
      let included: boolean = false;
      for(let i=0; i<this.countrySeries.length; i++){
        if(this.countrySeries[i].name == this.map1.get(event.value))
        included = true;
      }
      if(!included){
        this.counter++;
        this.countrySeries.push({
          name: this.map1.get(event.value),
          type: 'line',
          data: this.contryValuesByYears(event.value, 1980, 2020),
          smooth: true
        })
        this.chosenCountries.push(this.map1.get(event.value) as string)
        setTimeout(()=>{
          this.option && this.myChart.setOption(this.option);
        }, 1000)
      }
    }
  }

  remove(event: any){
    if(this.counter>1){
      this.chosenCountries = this.chosenCountries.filter((value, index, arr)=>{
        return value != this.map1.get(event.value);
      });
      this.countrySeries = this.countrySeries.filter((value: any)=>{
        return value.name != this.map1.get(event.value);
      });
      this.option.series = this.countrySeries;
      this.option.legend.data = this.chosenCountries;
      this.option && this.myChart.setOption(this.option, true);
    }
  }

  clearAll(){
    this.counter = 0;
    this.countrySeries = [];
    this.chosenCountries = [];
    this.option.series = this.countrySeries;
    this.option.legend.data = this.chosenCountries;
    this.option && this.myChart.setOption(this.option, true);
  }
}
