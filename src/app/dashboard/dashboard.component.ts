import { DashboardService } from '../services/dashboard.service'
import * as echarts from 'echarts'
import { Component, OnInit } from '@angular/core'
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  GeoGdp: number = 0;
  total: number = 0;
  world: number = 0;
  others: number = 0;
  years: number[] = [];
  gdpByYears: number[] = [];
  countries: string[] = [];
  countryCodes: string[] = [];
  array: number[] = [];
  gdpValues: number[] = [];
  myChart: any;
  chartDom: any;
  option: any;

  map1: Map<any, any> = new Map();
  constructor (public dashboardService: DashboardService) {
    this.dashboardService.getData('GEO', 2020).subscribe((data) => {
      this.GeoGdp = data[1][0].value
    })
  }

  ngOnInit () {
    // get all data for 2020 year
    this.dashboardService.getData('all', 2020).subscribe((data) => {
      for (let i = 49; i <= 265; i++) {
        this.total += data[1][i].value
        if (data[1][i].value != null) {
          this.array.push(data[1][i].value)
          this.countries.push(data[1][i].country.value)
          this.countryCodes.push(data[1][i].countryiso3code)
        }
      }
      this.gdpValues = this.array.slice()
      this.world = data[1][48].value // world value
      this.array.sort(function (a, b) {
        return a < b ? 1 : -1
      }) // descending  order

      this.others = this.total
      for (let i = 0; i < 10; i++) {
        this.others -= this.array[i]
      }
      for (let i = 1980; i < 2021; i++) this.years.push(i)
      for (let i = 49; i <= 265; i++) {
        if (data[1][i].value != null) { this.map1.set(data[1][i].value, data[1][i].country.value) }
      }

      // type EChartsOption = echarts.EChartsOption;

      const chartDom = document.getElementById('main')!
      const myChart = echarts.init(chartDom, 'dark')
      const pieOption: any = {
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
              { value: this.others, name: 'Others' }
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
      }

      pieOption && myChart.setOption(pieOption)

      this.dashboardService.getByYear('Afg').subscribe((data) => {
        for (let i = 0; i <= 2020 - 1981; i++) {
          this.gdpByYears.unshift(data[1][i].value)
        }

        this.chartDom = document.getElementById('second')!
        this.myChart = echarts.init(this.chartDom, 'dark')
        this.option = {
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
        }

        this.option && this.myChart.setOption(this.option)
      })
    })
  }

  // graph data would be updated according to chosen one.
  drawLine (event: any) {
    this.gdpByYears = [] // empty array
    this.dashboardService.getByYear(event.value).subscribe((data) => {
      for (let i = 0; i <= 2020 - 1981; i++) {
        this.gdpByYears.unshift(data[1][i].value)
      }

      this.option.series.data = this.gdpByYears
      this.option = {
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
      }

      this.option && this.myChart.setOption(this.option)
    })
  }
}
