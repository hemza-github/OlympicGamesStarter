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
              '#FFD700', // Or
              '#C0C0C0', // Argent
              '#CD7F32', // Bronze
              '#ADD8E6', // Bleu clair
              '#FF69B4', // Rose
            ],
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: 'top',
          },
        },
      },
    });
  }
}
