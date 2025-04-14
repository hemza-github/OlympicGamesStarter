import { Component, OnInit } from '@angular/core';
import { OlympicService } from '../../core/services/olympic.service';
import { Olympic } from '../../core/models/Olympic';
import { Chart, registerables } from 'chart.js';
import { Router } from '@angular/router';
import { Statistics } from '../../core/models/Statistics';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public nombreDeJO: number = 0;
  public nombreDePays: number = 0;
  public olympicsData: Olympic[] = [];

  homeStats: Statistics[] = []; // Mise à jour après calcul

  chart!: Chart; // Référence au graphique
  validIds: number[] = []; // Liste des IDs valides pour navigation

  constructor(private olympicService: OlympicService, private router: Router) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.fetchOlympicsData();
  }

  // Méthode pour récupérer et initialiser les données
  fetchOlympicsData(): void {
    this.olympicService.getOlympicsData().subscribe((data) => {
      this.olympicsData = data;
      this.nombreDePays = this.olympicsData.length;

      // Calculer le nombre d'éditions uniques
      const years = new Set<number>();
      this.olympicsData.forEach((olympic) => {
        olympic.participations.forEach((participation) =>
          years.add(participation.year)
        );
      });
      this.nombreDeJO = years.size;

      // Mise à jour de `homeStats`
      this.homeStats = [
        { label: 'Nombre de JO', value: this.nombreDeJO },
        { label: 'Nombre de Pays', value: this.nombreDePays },
      ];

      this.initializeValidIds();
      this.initializeChart();
    });
  }

  // Initialise la liste des IDs valides
  private initializeValidIds(): void {
    this.validIds = this.olympicsData.map((olympic) => olympic.id);
  }

  // Méthode pour initialiser le graphique
  private initializeChart(): void {
    const labels = this.olympicsData.map((olympic) => olympic.country);
    const dataValues = this.olympicsData.map((olympic) =>
      olympic.participations.reduce((total, p) => total + p.medalsCount, 0)
    );

    this.chart = new Chart('pieChart', {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Total des médailles',
            data: dataValues,
            backgroundColor: [
              '#956065',
              '#B8CBE7',
              '#89A1DB',
              '#793D52',
              '#9780A1',
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
              title: (tooltipItems) => {
                const country = tooltipItems[0].label || '';
                return '🏅 ' + country;
              },
              label: (context) => {
                const value = context.parsed;
                return `${value}`;
              },
            },
          },
          legend: {
            display: true,
            position: 'top',
          },
        },
        onClick: (event, elements) => {
          if (elements.length > 0) {
            const index = elements[0].index;
            const selectedId = this.olympicsData[index].id;
            if (this.isValidId(selectedId)) {
              this.navigateToDetail(selectedId);
            } else {
              this.router.navigate(['/not-found']);
            }
          }
        },
      },
    });
  }

  // Vérifie si l'ID est valide
  private isValidId(id: number): boolean {
    return this.validIds.includes(id);
  }

  // Redirige vers la page détail
  private navigateToDetail(id: number): void {
    this.router.navigate(['/detail', id]);
  }
}
