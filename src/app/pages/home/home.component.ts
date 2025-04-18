import { Component, OnInit, OnDestroy } from '@angular/core'; // Import des hooks pour gérer le cycle de vie
import { OlympicService } from '../../core/services/olympic.service'; // Service pour récupérer les données des Jeux Olympiques
import { Olympic } from '../../core/models/Olympic'; // Modèle des données des Olympiques
import { Chart, registerables } from 'chart.js'; // Bibliothèque Chart.js pour les graphiques
import ChartDataLabels from 'chartjs-plugin-datalabels'; // Plugin pour afficher les labels
import { Router } from '@angular/router'; // Service pour la navigation
import { Statistics } from '../../core/models/Statistics'; // Modèle pour les statistiques
import { Subscription } from 'rxjs';

// Enregistrement des plugins nécessaires avec Chart.js
Chart.register(...registerables, ChartDataLabels);

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  // ---- Propriétés ----

  public nombreDeJO: number = 0; // Nombre total d'éditions des JO
  public nombreDePays: number = 0; // Nombre total de pays ayant participé
  public olympicsData: Olympic[] = []; // Données des JO récupérées
  public homeStats: Statistics[] = []; // Liste des statistiques dynamiques
  private chart!: Chart; // Référence au graphique pour destruction
  private validIds: number[] = []; // Liste des IDs valides pour navigation
  private subscription!: Subscription;

  constructor(
    private olympicService: OlympicService, // Service pour récupérer les données des JO
    private router: Router // Service pour la navigation
  ) {
    Chart.register(...registerables); // Enregistre tous les contrôleurs nécessaires
  }

  // ---- Méthodes du cycle de vie ----

  /**
   * Appelé lors de l'initialisation du composant pour charger les données.
   */
  ngOnInit(): void {
    this.fetchOlympicsData(); // Récupère les données des JO
  }

  /**
   * Appelé avant la destruction du composant pour nettoyer les ressources.
   */
  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy(); // Nettoie le graphique pour éviter les fuites de mémoire
    }
    if (this.subscription) {
      this.subscription.unsubscribe(); // Se désabonne de l'observable pour éviter les fuites
    }
  }

  // ---- Méthodes principales ----

  /**
   * Récupère les données des JO et met à jour les statistiques.
   */
  private fetchOlympicsData(): void {
    this.subscription = this.olympicService
      .getOlympicsData()
      .subscribe((data) => {
        this.olympicsData = data; // Stocke les données des JO
        this.nombreDePays = this.olympicsData.length; // Nombre total de pays

        // Calcul du nombre unique d'éditions des JO
        const years = new Set<number>();
        this.olympicsData.forEach((olympic) => {
          olympic.participations.forEach((participation) =>
            years.add(participation.year)
          );
        });
        this.nombreDeJO = years.size; // Nombre total d'éditions uniques

        // Mise à jour des statistiques dynamiques
        this.homeStats = [
          { label: 'Nombre de JO', value: this.nombreDeJO },
          { label: 'Nombre de Pays', value: this.nombreDePays },
        ];

        // Initialise les IDs valides et le graphique
        this.initializeValidIds();
        this.initializeChart();
      });
  }

  /**
   * Initialise la liste des IDs valides pour la navigation.
   */
  private initializeValidIds(): void {
    this.validIds = this.olympicsData.map((olympic) => olympic.id);
  }

  /**
   * Initialise le graphique avec le plugin `chartjs-plugin-datalabels`.
   */
  private initializeChart(): void {
    const labels = this.olympicsData.map((olympic) => olympic.country); // Récupère les noms des pays
    const dataValues = this.olympicsData.map((olympic) =>
      olympic.participations.reduce(
        (total, p) => Number(total) + Number(p.medalsCount),
        0
      )
    ); // Total des médailles par pays

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
        layout: {
          padding: {
            bottom: 50,
            left: 150,
            right: 150,
          },
        },
        plugins: {
          legend: {
            display: true,
            position: 'top', // Positionne la légende au-dessus du graphique
            labels: {
              padding: 20, // Ajoute de l'espace entre chaque élément de la légende
              font: {
                size: 14, // Ajuste la taille de la police
              },
            },
          },
          datalabels: {
            color: '#000',
            formatter: (value, context) => {
              const total = context.chart.data.datasets[0].data.reduce(
                (sum, val) => Number(sum) + Number(val),
                0
              );
              const percentage =
                ((value / Number(total || 1)) * 100).toFixed(2) + '%'; // Calcule le pourcentage
              return `${
                context.chart.data.labels?.[context.dataIndex] ?? 'N/A'
              } (${percentage})`; // Nom + pourcentage
            },
            anchor: 'end',
            align: 'end',
            offset: 10, // Décalage des labels
            font: {
              size: 14,
              weight: 'bold',
            },
          },
          tooltip: {
            callbacks: {
              title: (tooltipItems) => {
                const country = tooltipItems[0]?.label || 'Pays inconnu';
                return `🏅 ${country}`;
              },
              label: (tooltipItem) => {
                const value = tooltipItem.raw as number;
                return `${value} médailles`;
              },
            },
          },
        },
        onClick: (event, elements) => {
          if (elements.length > 0) {
            const index = elements[0].index;
            const selectedId = this.olympicsData[index]?.id;
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
  /**
   * Vérifie si un ID est valide pour la navigation.
   */
  private isValidId(id: number): boolean {
    return this.validIds.includes(id);
  }

  /**
   * Navigue vers la page des détails d'un pays.
   */
  private navigateToDetail(id: number): void {
    this.router.navigate(['/detail', id]);
  }
}
