import { Component, Input, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { Olympic } from '../../../core/models/Olympic';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
})
export class ChartComponent implements OnInit {
  @Input() data!: Olympic[];
  chart!: Chart;

  constructor() {
    // Registration nécessaire pour Chart.js
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.initializeChart();
  }

  initializeChart(): void {
    const labels = this.data.map((olympic) => olympic.country);
    const dataValues = this.data.map((olympic) =>
      olympic.participations.reduce((total, p) => total + p.medalsCount, 0)
    );

    // Création du graphique
    this.chart = new Chart('pieChart', {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Total des médailles',
            data: dataValues,
            backgroundColor: [
              '#956065', // Or
              '#B8CBE7', // Argent
              '#89A1DB', // Bronze
              '#793D52', // Bleu clair
              '#9780A1', // Rose
            ],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          tooltip: {
            callbacks: {
              title: function (tooltipItems) {
                const country = tooltipItems[0].label || '';
                return '🏅 ' + country;
              },
              label: function (context) {
                const value = context.parsed;
                return `${value}`; // Convertit le nombre en chaîne
              },
            },
          },
          legend: {
            display: true,
            position: 'top',
          },
        },
      },
    });
  }
}
