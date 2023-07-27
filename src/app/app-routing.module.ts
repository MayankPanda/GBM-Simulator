import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PlotDisplayComponent } from './plot-display/plot-display.component';
import { ChartPageComponent } from './chart-page/chart-page.component'; 
import { AlphaVantageApiComponent } from './alpha-vantage-api/alpha-vantage-api.component';
import { ForexGBMComponent } from './forex-gbm/forex-gbm.component';
import { HomePageComponent } from './home-page/home-page.component';
const routes: Routes = [
  { path: '', redirectTo: '/homepage', pathMatch: 'full' }, // Default route
  { path: 'button-page', component: PlotDisplayComponent },
  { path: 'chart-page', component: ChartPageComponent },
  { path: 'stocksgbm', component: AlphaVantageApiComponent },
  { path: 'forexgbm', component: ForexGBMComponent },
  { path: 'homepage', component: HomePageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
