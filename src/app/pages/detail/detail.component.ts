import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core'; // Import des hooks de cycle de vie OnInit et OnDestroy
import { ActivatedRoute, Router } from '@angular/router'; // Services pour gérer les routes et accéder aux paramètres de l'URL
import { OlympicService } from '../../core/services/olympic.service'; // Service pour récupérer les données des Jeux Olympiques
import { Chart, registerables } from 'chart.js'; // Bibliothèque pour gérer les graphiques
import { Olympic } from '../../core/models/Olympic'; // Modèle des données Olympiques
import { Location } from '@angular/common'; // Service pour gérer la navigation dans l'historique

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit, OnDestroy {
  // ---- Propriétés de données ----

  // Statistiques dynamiques
  public nombreDeParticipations: number = 0;
  public nombreDeMedailles: number = 0;
  public nombreAthletes: number = 0;
  private subscription!: Subscription; // Abonnement pour gérer les flux de données

  // Objet contenant les détails des Jeux Olympiques pour un pays spécifique
  public olympic: Olympic | undefined;

  // Instance de graphique pour gérer le chart.js
  public chart!: Chart;

  constructor(
    private olympicService: OlympicService, // Service pour récupérer les données Olympiques
    private route: ActivatedRoute, // Service pour accéder aux paramètres de la route
    private router: Router, // Service pour naviguer vers une autre route
    private location: Location // Service pour naviguer dans l'historique
  ) {
    Chart.register(...registerables); // Enregistrement des composants nécessaires de Chart.js
  }

  // ---- Méthodes du cycle de vie ----

  // Initialisation du composant : Récupère les données pour un pays spécifique
  ngOnInit(): void {
    this.fetchOlympicData(); // Appelle la méthode pour charger les données
  }

  // Méthode appelée avant la destruction du composant
  ngOnDestroy(): void {
    // Nettoyage de l'instance Chart.js pour éviter des conflits ou fuites de mémoire
    if (this.chart) {
      this.chart.destroy();
    }
    if (this.subscription) {
      this.subscription.unsubscribe(); // Se désabonne de l'observable pour éviter les fuites de mémoire
    }
  }

  // ---- Méthodes principales ----

  /**
   * Récupère les données pour un pays spécifique à partir de l'ID passé dans l'URL.
   * Vérifie si l'ID est valide et charge les détails correspondants.
   */
  fetchOlympicData(): void {
    this.route.paramMap.subscribe((params) => {
      const countryId = Number(params.get('id')); // Récupération de l'ID du pays depuis l'URL

      if (!countryId) {
        this.router.navigate(['/not-found']); // Redirige vers une page "not found" si l'ID est invalide
        return;
      }

      // Appelle le service pour récupérer les données
      this.subscription = this.olympicService
        .getOlympicsData()
        .subscribe((data) => {
          this.olympic = data.find((olympic) => olympic.id === countryId);

          if (this.olympic) {
            this.calculateStatistics(); // Calcule les statistiques pour le pays sélectionné
            this.initializeChart(); // Initialise le graphique pour afficher les données
          } else {
            this.router.navigate(['/not-found']); // Redirige si aucune donnée n'est trouvée pour l'ID donné
          }
        });
    });
  }

  /**
   * Calcule les statistiques dynamiques pour le pays sélectionné :
   * - Nombre de participations
   * - Nombre total de médailles
   * - Nombre total d'athlètes
   */
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

  /**
   * Initialise le graphique avec les données des médailles par année.
   * Configure l'axe Y avec des limites dynamiques et l'axe X pour les années.
   */
  private initializeChart(): void {
    if (this.olympic) {
      const labels = this.olympic.participations.map((p) => p.year); // Récupère les années de participation
      const dataValues = this.olympic.participations.map((p) => p.medalsCount); // Récupère les nombres de médailles

      this.chart = new Chart('medalsChart', {
        type: 'line', // Graphique de type "line"
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Medals by Year', // Titre du dataset
              data: dataValues, // Données à afficher
              borderColor: 'rgba(75, 192, 192, 1)', // Couleur des bordures
              backgroundColor: 'rgba(75, 192, 192, 0.2)', // Couleur de fond
              fill: false, // Pas de remplissage sous la ligne
            },
          ],
        },
        options: {
          responsive: true, // Rend le graphique responsive
          maintainAspectRatio: false, // Permet d'ajuster le graphique au conteneur
          scales: {
            y: {
              beginAtZero: true, // L'axe Y commence à 0
              min: 0, // Limite minimale pour l'axe Y
              max: 140, // Limite maximale pour l'axe Y
            },
          },
        },
      });
    }
  }

  /**
   * Méthode pour revenir à la page précédente dans l'historique.
   */
  goBack(): void {
    this.location.back();
  }
}
