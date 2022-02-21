import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AnalyticsComponent } from './analytics/analytics.component';
import { HttpClientModule } from '@angular/common/http';
import { NgxEchartsModule } from 'ngx-echarts';
import { enableProdMode } from '@angular/core';
import { NumberSuffixPipe } from './services/number-suffix.pipe';

@NgModule({
  declarations: [AppComponent, DashboardComponent, AnalyticsComponent, NumberSuffixPipe],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgxEchartsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
