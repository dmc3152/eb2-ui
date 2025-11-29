import { Component, computed, input } from '@angular/core';
import { TriviaPlayerScore } from '@graphql';
import { ChartConfiguration, ChartOptions, Plugin } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import ChartDataLabels from 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-player-score',
  imports: [BaseChartDirective],
  templateUrl: './player-score.html',
  styleUrl: './player-score.scss'
})
export class PlayerScore {
  data = input.required<TriviaPlayerScore[]>();

  chartPlugins: Plugin[] = [ChartDataLabels];

  barChartData = computed<ChartConfiguration<'bar'>['data']>(() => {
    return this.data().reduce((chartData, score) => {
      chartData.labels?.push(score.category);
      chartData.datasets[0].data.push(score.score);
      return chartData;
    }, { labels: [], datasets: [{ data: [], backgroundColor: 'rgba(0, 105, 51, 1)' }] } as ChartConfiguration<'bar'>['data']);
  });

  barChartOptions: ChartOptions = {
    responsive: true,
    resizeDelay: 5,
    // maintainAspectRatio: false,
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          precision: 0,
          // stepSize: 1,
          callback: function (value: any) {
            // Optional: Ensures only integer values are returned, useful for complex data
            if (value % 1 === 0) {
              return value;
            }
          }
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
  };
}
