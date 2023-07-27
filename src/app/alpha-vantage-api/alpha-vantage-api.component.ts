import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chart, registerables } from 'chart.js';
import { tap } from 'rxjs/operators';

Chart.register(...registerables);

@Component({
  selector: 'app-alpha-vantage-api',
  template: `
  <div class="chart-container">
  <select [(ngModel)]="selectedStock" (change)="onStockChange(selectedStock)">
    <option *ngFor="let stock of stocks" [value]="stock">{{ stock }}</option>
  </select>
  <canvas #chartCanvas></canvas>
</div>
  `,
  styles: [
    `
    canvas
    {
      transform:translateY(+7vh);
    }
    select
    {
      transform:translateY(+7vh);
    }
      .chart-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100vh;
      }

      .dropdown-container {
        margin-bottom: 20px;
      }
    `
  ]
})
export class AlphaVantageApiComponent implements OnInit {
  
  private baseUrl = 'https://www.alphavantage.co/query';
  private apiKey = '92UF117VIOU630QD'; 
  closingPrices: number[] = [];
  returns: number[] = [];
  mean: number = 0;
  standardDeviation: number = 0;
  gbmPrices: number[] = [];
  selectedStock: string = '';
  stocks: string[] = ['IBM', 'GOOG', 'AAPL', 'MSFT', 'AMZN']; // Add more stocks here
  xAxisLabels:string[]=[];
  chartInstance: Chart | null = null;
  @ViewChild('chartCanvas', { static: true }) chartCanvas!: ElementRef<HTMLCanvasElement>;
  private chart: Chart | undefined;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    // Set the default selected stock
    this.selectedStock = this.stocks[0];
    this.makeApiCall();
  }

  ngAfterViewInit(): void {
    // this.anotherFunctionUsingMeanAndStandardDeviation();
  }

  makeApiCall(): void {
    const apiUrl = `${this.baseUrl}?function=TIME_SERIES_DAILY&symbol=${this.selectedStock}&outputsize=compact&apikey=${this.apiKey}`;
    this.http.get<any>(apiUrl).subscribe(
      (response) => {
        this.parseResponseData(response);
        this.calculateReturns();
        this.calculateMean();
        this.calculateStandardDeviation();
        // Call the function that needs the mean and standard deviation here
        this.anotherFunctionUsingMeanAndStandardDeviation();
        // Start updating the graph at a 5-second interval
        this.startGraphUpdateInterval();
      },
      (error) => {
        console.error('API Error:', error);
      }
    );
  }

  startGraphUpdateInterval(): void {
    // Generate new values and update the graph every 5 seconds
    setInterval(() => {
      this.updateGraph();
    }, 5000);
  }

  updateGraph(): void {
    console.log("In update Chart");
    const newPrice = this.generateNextGBMValue();
    this.gbmPrices.shift(); // Remove the first element from the GBM prices array
    this.gbmPrices.push(newPrice); // Add the new value at the end
  
    // Update the x-axis labels based on the updated data length
    const updatedXAxisLabels = this.generateXAxisLabels();
  
    // Update the chart data with the new GBM prices and x-axis labels
    if (this.chartInstance) {
      this.chartInstance.data.datasets![0].data = this.gbmPrices;
      this.chartInstance.data.labels = updatedXAxisLabels;
      this.chartInstance.update();
  
      // Update the local xAxisLabels array to reflect the changes
      this.xAxisLabels = updatedXAxisLabels;
    }
  }

  generateXAxisLabels(): string[] {
    const labels: string[] = [];
    const startIndex = this.gbmPrices.length - 29; // Show 30 labels at a time
    for (let i = startIndex; i <= this.gbmPrices.length; i++) {
      labels.push(`${i}`);
    }
    return labels;
  }

  generateNextGBMValue(): number {
    // Generate the next value in the GBM sequence using the formula
    // You can use the existing code from quotePrice() function for this calculation
    const sigma = this.standardDeviation;
    const mu = this.mean;
    const dt = 0.000000012;
    const return_rate_per_millisecond = mu / 86400000;
    const volatility_per_millisecond = Math.pow(dt, 0.5) * sigma;
    const return_rate = getRandomGaussian(return_rate_per_millisecond, volatility_per_millisecond);
    const current_price = this.gbmPrices[this.gbmPrices.length - 1];
    return current_price * (1 + return_rate);
  }

  updateChart(): void {
    if (this.chart) {
      // Update the chart data with the new GBM prices
      this.chart.data.datasets![0].data = this.gbmPrices;
      this.chart.update();
    }
  }

  parseResponseData(response: any): void {
    const timeSeriesData = response['Time Series (Daily)'];
    if (!timeSeriesData) {
      console.error('No time series data found in API response.');
      return;
    }

    // Extract the closing prices and store them in the array
    this.closingPrices = Object.values(timeSeriesData).map((data: any) => parseFloat(data['4. close']));

    // Reverse the array so that the latest price is at the end
    this.closingPrices = this.closingPrices.reverse();

    // Log the closing prices array
    console.log('Closing Prices Array:', this.closingPrices);
  }

  calculateReturns(): void {
    // Calculate the returns array
    for (let i = 0; i < this.closingPrices.length - 1; i++) {
      const currentClosing = this.closingPrices[i];
      const nextClosing = this.closingPrices[i + 1];
      const returnPercentage = (nextClosing - currentClosing) / currentClosing;
      this.returns.push(returnPercentage);
    }

    // Log the returns array
    console.log('Returns Array:', this.returns);
  }

  calculateMean(): void {
    // Calculate the mean of the returns array
    this.mean = this.returns.reduce((acc, value) => acc + value, 0) / this.returns.length;
    console.log('Mean:', this.mean);
  }

  calculateStandardDeviation(): void {
    // Calculate the standard deviation of the returns array
    const mean = this.returns.reduce((acc, value) => acc + value, 0) / this.returns.length;
    const squaredDifferences = this.returns.map((value) => Math.pow(value - mean, 2));
    const variance = squaredDifferences.reduce((acc, value) => acc + value, 0) / this.returns.length;
    this.standardDeviation = Math.sqrt(variance);
    console.log('Standard Deviation:', this.standardDeviation);
  }

  anotherFunctionUsingMeanAndStandardDeviation(): void {
    console.log('Mean:', this.mean);
    console.log('Standard Deviation:', this.standardDeviation);

    // Call quotePrice() function to get the GBM prices array
    this.gbmPrices = this.quotePrice();
    console.log('GBM Prices Array:', this.gbmPrices);

    // Plot the GBM prices as a line chart
    this.createChart();
  
    // Perform any other operations using mean, standard deviation, and GBM prices here
  }
  quotePrice(): number[] {
    const sigma = this.standardDeviation; // Daily volatility from historical data
    const mu = this.mean; // Daily average return rate from historical data
    const dt = 0.000000012; // Get dt corresponding to 1 millisecond
    const number_of_values = 30;
    const starting_price = this.closingPrices[this.closingPrices.length - 1]; // Latest price from closingPrices array
    let current_price = starting_price;
    const quote_prices: number[] = [];
    const return_rate_per_millisecond = mu / 86400000;
    const volatility_per_millisecond = Math.pow(dt, 0.5) * sigma;

    for (let i = 0; i < number_of_values; i++) {
      const return_rate = getRandomGaussian(return_rate_per_millisecond, volatility_per_millisecond);
      current_price = current_price * (1 + return_rate);
      quote_prices.push(current_price);
    }
    return quote_prices;
  }

  createChart(): void {
    const ctx = this.chartCanvas.nativeElement.getContext('2d')!;

    // Destroy the existing chart if it exists
    if (this.chartInstance) {
      this.chartInstance.destroy();
    }

    // Generate the initial x-axis labels based on the initial data length
    const initialXAxisLabels = Array.from({ length: this.gbmPrices.length }, (_, i) => `${i + 1}`);
    this.xAxisLabels=initialXAxisLabels;
    this.chartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: initialXAxisLabels,
        datasets: [
          {
            label: 'GBM Prices',
            data: this.gbmPrices,
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 2,
            fill: false
          }
        ]
      },
      options: {
        scales: {
          x: {
            type: 'category',
            labels: this.xAxisLabels,
            position: 'bottom'
          },
          y: {
            type: 'linear',
            beginAtZero: false // Set to true or false based on your data range
          }
        },
        responsive: true,
        maintainAspectRatio: false
      }
    });

    // Call updateGraph() after the chart is created to start updating the graph
    this.updateGraph();
  }


  // generateXAxisLabels(): string[] {
  //   const labels: string[] = [];
  //   for (let i = 1; i <= this.gbmPrices.length; i++) {
  //     labels.push(`Label ${i}`);
  //   }
  //   return labels;
  // }

  onStockChange(selectedStock: string): void {
    this.selectedStock = selectedStock;
    this.makeApiCall();
  }
  
  

}
function getRandomGaussian(mu: number, sigma: number): number {
  let u = 0;
  let v = 0;
  let s = 0;

  do {
    u = Math.random() * 2 - 1;
    v = Math.random() * 2 - 1;
    s = u * u + v * v;
  } while (s >= 1 || s === 0);

  const multiplier = Math.sqrt(-2 * Math.log(s) / s);
  const gaussian = u * multiplier;

  // Adjust the gaussian to have the desired mean and standard deviation
  return mu + sigma * gaussian;
}
