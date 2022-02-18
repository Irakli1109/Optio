import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  url1: string = "https://api.worldbank.org/v2/country/all/indicator/NY.GDP.MKTP.CD?format=json&date=2020&page=3";
  url2: string = "https://api.worldbank.org/v2/country";
  years :number[] = [];
  constructor(public http: HttpClient) { }

  getData(country: string, date: number): Observable<any>{
    return this.http.get(this.url2+`/${country}/indicator/NY.GDP.MKTP.CD?format=json&date=${date}&per_page=266`);
  }

  yearFilter(start: number = 1980, end: number = 2020): number[]{
    this.years = [];
    for(let i=start; i<=end; i++)
      this.years.push(i);
    return this.years;
  }

  getCountries(): Observable<any>{
    return this.http.get(this.url2+`/all/indicator/NY.GDP.MKTP.CD?format=json&date=2020&per_page=266`);
  }
}
