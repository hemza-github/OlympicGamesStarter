import { Component, OnInit, OnDestroy } from '@angular/core'; // Import des hooks pour gérer le cycle de vie
import { OlympicService } from '../../core/services/olympic.service'; // Service pour récupérer les données des Jeux Olympiques
import { Olympic } from '../../core/models/Olympic'; // Modèle des données des Olympiques
import { Chart, registerables } from 'chart.js'; // Bibliothèque Chart.js pour les graphiques
import { Router } from '@angular/router'; // Service pour la navigation
import { Statistics } from '../../core/models/Statistics'; // Modèle pour les statistiques

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  // ---- Propriétés ----

  // Statistiques dynamiques
  public nombreDeJO: number = 0; // Nombre total d'éditions des JO
  public nombreDePays: number = 0; // Nombre total de pays ayant participé
  public olympicsData: Olympic[] = []; // Données des JO récupérées

  // Liste des statistiques dynamiques pour l'affichage
  public homeStats: Statistics[] = [];

  // Référence au graphique pour faciliter sa destruction
  private chart!: Chart;

  // Liste des IDs valides pour naviguer vers les détails
  private validIds: number[] = [];

  constructor(
    private olympicService: OlympicService, // Injection du service pour récupérer les données
    private router: Router // Service pour la navigation
  ) {
    Chart.register(...registerables); // Enregistrement des composants nécessaires de Chart.js
  }

  // ---- Méthodes du cycle de vie ----

  /**
   * Hook appelé à l'initialisation du composant.
   * Charge les données des JO et initialise les statistiques.
   */
  ngOnInit(): void {
    this.fetchOlympicsData(); // Récupération des données
  }

  /**
   * Hook appelé avant la destruction du composant.
   * Utilisé pour nettoyer les ressources.
   */
  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy(); // Détruit le graphique pour éviter les fuites de mémoire
    }
  }

  // ---- Méthodes principales ----

  /**
   * Récupère les données des JO via le service et met à jour les statistiques.
   */
  private fetchOlympicsData(): void {
    this.olympicService.getOlympicsData().subscribe((data) => {
      this.olympicsData = data; // Stocke les données récupérées
      this.nombreDePays = this.olympicsData.length; // Nombre total de pays

      // Calcul du nombre unique d'éditions des JO
      const years = new Set<number>();
      this.olympicsData.forEach((olympic) => {
        olympic.participations.forEach((participation) =>
          years.add(participation.year)
        );
      });
      this.nombreDeJO = years.size; // Nombre total d'éditions des JO

      // Mise à jour des statistiques dynamiques
      this.homeStats = [
        { label: 'Nombre de JO', value: this.nombreDeJO },
        { label: 'Nombre de Pays', value: this.nombreDePays },
      ];

      // Initialisation des IDs valides pour la navigation
      this.initializeValidIds();

      // Création du graphique avec les données
      this.initializeChart();
    });
  }

  /**
   * Initialise la liste des IDs valides pour la navigation.
   */
  private initializeValidIds(): void {
    this.validIds = this.olympicsData.map((olympic) => olympic.id); // Extrait les IDs des données récupérées
  }

  /**
   * Initialise le graphique des médailles par pays.
   */
  private initializeChart(): void {
    const labels = this.olympicsData.map((olympic) => olympic.country); // Récupère les noms des pays
    const dataValues = this.olympicsData.map((olympic) =>
      olympic.participations.reduce((total, p) => total + p.medalsCount, 0)
    ); // Calcule le total des médailles par pays

    this.chart = new Chart('pieChart', {
      type: 'pie', // Type de graphique "pie" (camembert)
      data: {
        labels: labels, // Labels pour l'axe X
        datasets: [
          {
            label: 'Total des médailles', // Titre du graphique
            data: dataValues, // Données à afficher
            backgroundColor: [
              '#956065',
              '#B8CBE7',
              '#89A1DB',
              '#793D52',
              '#9780A1',
            ], // Couleurs des sections
          },
        ],
      },
      options: {
        responsive: true, // Rend le graphique responsive
        maintainAspectRatio: false, // Permet d'ajuster la taille au conteneur
        plugins: {
          tooltip: {
            callbacks: {
              title: (tooltipItems) => {
                const country = tooltipItems[0].label || '';
                return '🏅 ' + country; // Affiche un emoji avec le nom du pays
              },
              label: (context) => {
                const value = context.parsed;
                return `${value}`; // Affiche la valeur directement
              },
            },
          },
          legend: {
            display: true, // Affiche la légende
            position: 'top', // Positionne la légende en haut
          },
        },
        onClick: (event, elements) => {
          if (elements.length > 0) {
            const index = elements[0].index; // Récupère l'index du pays sélectionné
            const selectedId = this.olympicsData[index].id; // Récupère l'ID du pays
            if (this.isValidId(selectedId)) {
              this.navigateToDetail(selectedId); // Navigation vers les détails du pays sélectionné
            } else {
              this.router.navigate(['/not-found']); // Redirige si l'ID est invalide
            }
          }
        },
      },
    });
  }

  /**
   * Vérifie si un ID est valide pour la navigation.
   * @param id - ID du pays à vérifier
   * @returns `true` si l'ID est valide, `false` sinon
   */
  private isValidId(id: number): boolean {
    return this.validIds.includes(id); // Vérifie la validité de l'ID
  }

  /**
   * Navigue vers la page des détails du pays sélectionné.
   * @param id - ID du pays sélectionné
   */
  private navigateToDetail(id: number): void {
    this.router.navigate(['/detail', id]); // Redirige vers la route /detail avec l'ID spécifié
  }
}
