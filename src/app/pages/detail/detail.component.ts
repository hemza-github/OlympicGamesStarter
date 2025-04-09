import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OlympicService } from '../../core/services/olympic.service';
import { Chart, registerables } from 'chart.js';
import { Olympic } from '../../core/models/Olympic';
import { StatisticsComponent } from '../statistics/statistics.component';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit {
  @ViewChild(StatisticsComponent) statisticsComponent!: StatisticsComponent;

  olympic: Olympic | undefined;
  countryId: number | undefined;
  chart: any;

  constructor(
    private olympicService: OlympicService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    // Enregistre les composants de Chart.js nécessaires
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.countryId = Number(params.get('id'));

      if (this.countryId) {
        this.loadOlympicData();
      } else {
        this.router.navigate(['/not-found']);
      }
    });
  }

  loadOlympicData(): void {
    this.olympicService.getOlympicsData().subscribe((data) => {
      this.olympic = data.find((olympic) => olympic.id === this.countryId);

      if (this.olympic) {
        this.createChart();
      } else {
        this.router.navigate(['/not-found']);
      }
    });
  }

  createChart(): void {
    if (this.olympic) {
      const years = this.olympic.participations.map((p) => p.year);
      const medals = this.olympic.participations.map((p) => p.medalsCount);

      const ctx = document.getElementById('medalsChart') as HTMLCanvasElement;
      if (ctx) {
        this.chart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: years,
            datasets: [
              {
                label: 'Médailles Gagnées',
                data: medals,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: false,
              },
            ],
          },
          options: {
            responsive: true,
            scales: {
              y: {
                beginAtZero: true,
                suggestedMax: 200, // Étend l'axe jusqu'à 100
              },
            },
          },
        });
      }
    }
  }
}
