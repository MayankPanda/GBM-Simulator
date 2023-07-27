import { Component } from '@angular/core';

@Component({
  selector: 'app-button-page',
  template: `
    <div class="button-container">
      <button mat-raised-button color="primary">Plot</button>
      <button mat-raised-button color="accent">End Simulation</button>
    </div>
    <a routerLink="/chart-page">Go to Chart Page</a>
  `,
  styles: [
    `
      .button-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100vh;
      }

      button {
        margin-bottom: 16px;
      }
    `
  ]
})
export class PlotDisplayComponent {}
