import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  url1: string =
    'https://api.worldbank.org/v2/country/all/indicator/NY.GDP.MKTP.CD?format=json&date=2020&page=3';
  url2: string = 'https://api.worldbank.org/v2/country';
  constructor(public http: HttpClient) {}

  //return observable for one country with one specific year
  getData(country: string, date: number): Observable<any> {
    return this.http.get(
      this.url2 +
        `/${country}/indicator/NY.GDP.MKTP.CD?format=json&date=${date}&per_page=266`
    );
  }
  //get country data for all year
  getByYear(country: string): Observable<any> {
    return this.http.get(
      this.url2 +
        `/${country}/indicator/NY.GDP.MKTP.CD?format=json&per_page=266`
    );
  }
}
