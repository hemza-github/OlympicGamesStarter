import { Component, Input, OnInit } from '@angular/core'; // Import des hooks Angular
import { OlympicService } from '../../core/services/olympic.service'; // Service pour récupérer les données des Jeux Olympiques
import { Statistics } from './../../core/models/Statistics'; // Modèle pour les statistiques
import { Olympic } from '../../core/models/Olympic'; // Modèle pour les données des Olympiques

@Component({
  selector: 'app-statistics', // Sélecteur du composant
  templateUrl: './statistics.component.html', // Chemin vers le fichier HTML
  styleUrls: ['./statistics.component.scss'], // Chemin vers les styles SCSS
})
export class StatisticsComponent implements OnInit {
  // ---- Entrées et propriétés ----

  @Input()
  stats: Statistics[] = []; // Liste des statistiques à afficher (injectée depuis le composant parent)

  public olympicsData: Olympic[] = []; // Liste des données des JO récupérées
  public nombreDeJO = 0; // Nombre total d'éditions des JO
  public nombreDePays = 0; // Nombre total de pays participants
  public nombreDeParticipations = 0; // Nombre total de participations aux JO
  public nombreDeMedailles = 0; // Nombre total de médailles remportées
  public nombreAthletes = 0; // Nombre total d'athlètes ayant participé

  constructor(private olympicService: OlympicService) {} // Injection du service OlympicService

  // ---- Méthodes du cycle de vie ----

  /**
   * Hook appelé à l'initialisation du composant.
   * Charge les données des JO et effectue les calculs nécessaires.
   */
  ngOnInit(): void {
    this.fetchOlympicsData();
  }

  // ---- Méthodes principales ----

  /**
   * Récupère les données des Jeux Olympiques via le service.
   * Une fois les données récupérées, déclenche les calculs nécessaires.
   */
  private fetchOlympicsData(): void {
    this.olympicService.getOlympicsData().subscribe((data) => {
      this.olympicsData = data; // Stocke les données récupérées
      this.performCalculations(); // Effectue les calculs nécessaires pour générer les statistiques
    });
  }

  /**
   * Calcule toutes les statistiques dynamiques et les met à jour dans la propriété `stats`.
   */
  private performCalculations(): void {
    this.calculateNombreDeJO(); // Calcul du nombre d'éditions des JO
    this.calculateNombreDePays(); // Calcul du nombre de pays participants
    this.calculateNombreDeParticipations(); // Calcul du nombre de participations aux JO
    this.calculateNombreDeMedailles(); // Calcul du nombre total de médailles remportées
    this.calculateNombreAthletes(); // Calcul du nombre total d'athlètes ayant participé

    // Mise à jour de l'objet `stats` pour affichage
    this.stats = [
      { label: 'Nombre de JO', value: this.nombreDeJO },
      { label: 'Nombre de Pays', value: this.nombreDePays },
      { label: 'Nombre de Participations', value: this.nombreDeParticipations },
      { label: 'Nombre de Médailles', value: this.nombreDeMedailles },
      { label: 'Nombre d’Athlètes', value: this.nombreAthletes },
    ];
  }

  // ---- Méthodes de calculs individuels ----

  /**
   * Calcule le nombre total d'éditions uniques des JO.
   */
  private calculateNombreDeJO(): void {
    const years = new Set<number>();
    this.olympicsData.forEach((olympic) => {
      olympic.participations.forEach((participation) =>
        years.add(participation.year)
      );
    });
    this.nombreDeJO = years.size; // Nombre d'années uniques (éditions des JO)
  }

  /**
   * Calcule le nombre total de pays ayant participé aux JO.
   */
  private calculateNombreDePays(): void {
    this.nombreDePays = this.olympicsData.length; // Le nombre de pays correspond à la taille des données des JO
  }

  /**
   * Calcule le nombre total de participations aux JO.
   */
  private calculateNombreDeParticipations(): void {
    this.nombreDeParticipations = this.olympicsData.reduce(
      (total, olympic) => total + olympic.participations.length, // Nombre de participations de chaque pays
      0
    );
  }

  /**
   * Calcule le nombre total de médailles remportées sur toutes les éditions.
   */
  private calculateNombreDeMedailles(): void {
    this.nombreDeMedailles = this.olympicsData.reduce((total, olympic) => {
      return (
        total +
        olympic.participations.reduce(
          (sum, participation) => sum + participation.medalsCount, // Somme des médailles par participation
          0
        )
      );
    }, 0);
  }

  /**
   * Calcule le nombre total d'athlètes ayant participé sur toutes les éditions.
   */
  private calculateNombreAthletes(): void {
    this.nombreAthletes = this.olympicsData.reduce((total, olympic) => {
      return (
        total +
        olympic.participations.reduce(
          (sum, participation) => sum + participation.athleteCount, // Somme des athlètes par participation
          0
        )
      );
    }, 0);
  }
}
