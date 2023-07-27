import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'; // Import HttpClientModule
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms'; 

import { AppComponent } from './app.component';
import { PlotDisplayComponent } from './plot-display/plot-display.component';
import { ChartPageComponent } from './chart-page/chart-page.component';
import { AlphaVantageApiComponent } from './alpha-vantage-api/alpha-vantage-api.component';
import { ForexGBMComponent } from './forex-gbm/forex-gbm.component';
import { HomePageComponent } from './home-page/home-page.component'; // Add the ChartPageComponent

@NgModule({
  declarations: [AppComponent, PlotDisplayComponent, ChartPageComponent, AlphaVantageApiComponent, ForexGBMComponent, HomePageComponent], // Add ChartPageComponent to the declarations
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule // Import the AppRoutingModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
