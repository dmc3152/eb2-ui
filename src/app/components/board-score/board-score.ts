import { Component, computed, input, Signal } from '@angular/core';
import { ChartConfiguration, ChartOptions, Plugin } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { TriviaGameScore } from '@graphql';

@Component({
  selector: 'app-board-score',
  imports: [BaseChartDirective],
  templateUrl: './board-score.html',
  styleUrl: './board-score.scss'
})
export class BoardScore {

  data = input.required<TriviaGameScore>();

  chartPlugins: Plugin[] = [ChartDataLabels];

  barChartData = computed<ChartConfiguration<'bar'>['data']>(() => {
    return this.data().scores.reduce((chartData, category) => {
      chartData.labels?.push(category.playerName);
      chartData.datasets[0].data.push(category.score);
      return chartData;
    }, { title: this.data().category, labels: [], datasets: [{ data: [], backgroundColor: 'rgba(0, 105, 51, 1)' }] } as ChartConfiguration<'bar'>['data']);
  });

  maxValue = computed(() => {
    return this.data().scores.reduce((largestScore, category) => {
      if (category.score > largestScore) largestScore = category.score;
      return largestScore;
    }, 0);
  })

  barChartOptions: Signal<ChartOptions> = computed<ChartOptions>(() => {
    const value: ChartOptions = {
      responsive: true,
      // resizeDelay: 5,
      maintainAspectRatio: false,
      scales: {
        x: {
          beginAtZero: true,
          max: this.maxValue(),
          ticks: {
            color: 'white',
            precision: 0,
            // stepSize: 1,
            callback: function (value: any) {
              // Optional: Ensures only integer values are returned, useful for complex data
              if (value % 1 === 0) {
                return value;
              }
            }
          },
          grid: {
            color: 'white'
          }
        },
        y: {
          ticks: {
            color: 'white'
          },
          grid: {
            color: 'white'
          }
        }
      },
      // resizeDelay: 5,
      indexAxis: 'y',
      plugins: {
        legend: {
          display: false
        },
        datalabels: {
          // Position the label (e.g., 'end' will put it on the edge of the bar)
          anchor: 'center',
          align: 'center',
          // Define the color and font of the label
          color: '#FFFFFF',
          font: {
            weight: 'bold',
          },
          // Callback function to format the displayed value
          formatter: (value, context) => {
            return value; // Displays the raw number
            // return value + '%'; // Example: Add a percentage sign
          },
        }
      },
    }
    return value;
  });
}
