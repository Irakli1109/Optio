import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from '../services/analytics.service';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss']
})
export class AnalyticsComponent implements OnInit {
  GeoGdp: number = 0;
  total: number = 0;
  array: number[] = [];
  constructor(public analyticsService: AnalyticsService) {
    this.analyticsService.getData("GEO", 2020).subscribe(data=>{
      //console.log(data[1]);
      this.GeoGdp = data[1][0].value;
    });
    this.analyticsService.getData("all", 2020).subscribe(data=>{
        for(let i=0; i<266; i++){
          this.total+=data[1][i].value;
          this.array.push(data[1][i]);
        }
    })
  }

  ngOnInit(): void {
  }
  getAPIResult(){
    this.analyticsService.getData("", 0).subscribe(data=>{
      console.log(data[1]);
    });
  }
}
