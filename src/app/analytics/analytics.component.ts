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
  constructor(public analytics: AnalyticsService){}

  ngOnInit(): void {
    this.chartDom = document.getElementById('main')!;
    this.myChart = echarts.init(this.chartDom, 'dark')
    this.option = {
      title: {
        text: 'Stacked Line'
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['Email', 'Union Ads', 'Video Ads', 'Direct', 'Search Engine', 'mevar']
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
      series: [
        {
          name: 'Email',
          type: 'line',
          data: [120, 132, 101, 134, 90, 230, 210],
          smooth: true
        },
        {
          name: 'Union Ads',
          type: 'line',
          data: [220, 182, 191, 234, 290, 330, 310],
          smooth: true
        },
        {
          name: 'Video Ads',
          type: 'line',
          data: [150, 232, 201, 154, 190, 330, 410],
          smooth: true
        },
        {
          name: 'Direct',
          type: 'line',
          data: [320, 332, 301, 334, 390, 330, 320],
          smooth: true
        },
        {
          name: 'Search Engine',
          type: 'line',
          data: [820, 932, 901, 934, 1290, 1330, 1320],
          smooth: true
        }
      ]
    };
    this.option.series.push({
      name: 'mevar',
          type: 'line',
          data: [0, 1032, 990, 934, 1260, 1330, 1320],
          smooth: true
    });
    this.option && this.myChart.setOption(this.option);
  }

  filter(val1: any, val2: any){
    this.option.xAxis.data = this.analytics.yearFilter(1990, 2000)
    console.log(this.option.xAxis.data)
    this.option && this.myChart.setOption(this.option);
  }
}
