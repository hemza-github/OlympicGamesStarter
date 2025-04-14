import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OlympicService } from '../../core/services/olympic.service';
import { Chart, registerables } from 'chart.js';
import { Olympic } from '../../core/models/Olympic';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit {
  public nombreDeParticipations: number = 0;
  public nombreDeMedailles: number = 0;
  public nombreAthletes: number = 0;

  public olympic: Olympic | undefined;
  public chart!: Chart;

  constructor(
    private olympicService: OlympicService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.fetchOlympicData();
  }

  // Récupère les données pour un pays spécifique
  fetchOlympicData(): void {
    this.route.paramMap.subscribe((params) => {
      const countryId = Number(params.get('id'));

      if (!countryId) {
        this.router.navigate(['/not-found']);
        return;
      }

      this.olympicService.getOlympicsData().subscribe((data) => {
        this.olympic = data.find((olympic) => olympic.id === countryId);

        if (this.olympic) {
          this.calculateStatistics();
          this.initializeChart();
        } else {
          this.router.navigate(['/not-found']);
        }
      });
    });
  }

  // Calcule les statistiques pour le pays sélectionné
  private calculateStatistics(): void {
    if (this.olympic) {
      this.nombreDeParticipations = this.olympic.participations.length;

      this.nombreDeMedailles = this.olympic.participations.reduce(
        (total, participation) => total + participation.medalsCount,
        0
      );

      this.nombreAthletes = this.olympic.participations.reduce(
        (total, participation) => total + participation.athleteCount,
        0
      );
    }
  }

  // Initialise le graphique
  private initializeChart(): void {
    if (this.olympic) {
      const labels = this.olympic.participations.map((p) => p.year);
      const dataValues = this.olympic.participations.map((p) => p.medalsCount);

      this.chart = new Chart('medalsChart', {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Médailles par Année',
              data: dataValues,
              borderColor: 'rgba(75, 192, 192, 1)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              fill: false,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    }
  }
}
