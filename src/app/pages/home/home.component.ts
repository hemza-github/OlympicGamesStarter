import { Component, OnInit, ViewChild } from '@angular/core';
import { OlympicService } from '../../core/services/olympic.service';
import { Olympic } from '../../core/models/Olympic';
import { Chart, registerables } from 'chart.js';
import { Router } from '@angular/router';
import { StatisticsComponent } from '../statistics/statistics.component';
import { Statistics } from './../../core/models/Statistics';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  @ViewChild(StatisticsComponent) statisticsComponent!: StatisticsComponent;

  public nombreDeJO: number = 0; // Nombre d'éditions des JO
  public nombreDePays: number = 0;
  public nombreDeMedailles!: number; // Nombre total de médailles
  public nombreAthletes!: number; // Nombre total d'athlètes
  public nombreDeParticipations!: number; // Nombre total de participations
  public olympicsData: Olympic[] = []; // Données récupérées

  public stats: Statistics[] = [
    { label: "Nombre d'éditions des JO", value: this.nombreDeJO },
    { label: 'Nombre de pays', value: this.nombreDePays },
  ]; // Contiendra les statistiques

  chart!: Chart; // Référence au graphique
  validIds: number[] = []; // Liste des IDs valides pour navigation

  constructor(private olympicService: OlympicService, private router: Router) {
    Chart.register(...registerables); // Registration nécessaire pour Chart.js
  }

  ngOnInit(): void {
    this.fetchOlympicsData(); // Récupérer les données
  }

  // Méthode pour récupérer les données des JO
  fetchOlympicsData(): void {
    this.olympicService.getOlympicsData().subscribe((data) => {
      this.olympicsData = data;
      this.initializeValidIds();
      this.initializeChart(); // Initialiser le graphique avec les données récupérées
      this.nombreDePays = this.olympicsData.length;
      const years = new Set<number>();
      this.olympicsData.forEach((olympic) => {
        olympic.participations.forEach((participation) => {
          years.add(participation.year); // Ajouter les années uniques
        });
      });
      this.nombreDeJO = years.size; // Taille du Set = nombre d'éditions uniques
      console.log(this.nombreDeJO);
      console.log(this.nombreDePays);
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
            const index = elements[0].index; // Index de la section cliquée
            const selectedId = this.olympicsData[index].id; // ID correspondant
            if (this.isValidId(selectedId)) {
              this.navigateToDetail(selectedId);
            } else {
              this.router.navigate(['/not-found']); // Redirection si l'ID est invalide
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
