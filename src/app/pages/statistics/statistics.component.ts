import { Statistics } from './../../core/models/Statistics';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { OlympicService } from '../../core/services/olympic.service';
import { Olympic } from '../../core/models/Olympic';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss'], // Correction pour "styleUrls"
})
export class StatisticsComponent {
  @Input()
  stats: Statistics[] = []; // Contiendra les statistiques

  public olympicsData: Olympic[] = []; // Contiendra les données récupérées
  public nombreDeJO: number = 0; // Nombre d'éditions uniques des JO
  public nombreDePays: number = 0; // Nombre de pays
  public nombreDeParticipations: number = 0; // Nombre total de participations
  public nombreDeMedailles: number = 0; // Nombre total de médailles
  public nombreAthletes: number = 0; // Nombre total d'athlètes

  constructor(private olympicService: OlympicService) {}

  ngOnInit(): void {
    console.log(this.stats); // Récupérer les données des JO au chargement
  }

  // Méthode pour récupérer les données depuis le service
  fetchOlympicsData(): void {
    this.olympicService.getOlympicsData().subscribe((data) => {
      this.olympicsData = data; // Stocker les données récupérées
      this.performCalculations(); // Appeler les calculs
      // this.emitData(); // Émettre les données calculées
    });
  }

  // Méthode pour effectuer les calculs
  private performCalculations(): void {
    this.calculateNombreDeJO(); // Calcul du nombre d'éditions
    this.calculateNombreDePays(); // Calcul du nombre de pays
    this.calculateNombreDeParticipations(); // Calcul du nombre de participations
    this.calculateNombreDeMedailles(); // Calcul du nombre de médailles
    this.calculateNombreAthletes(); // Calcul du nombre d'athlètes
  }

  // Méthode pour émettre les données calculées
  /* private emitData(): void {
    this.dataReady.emit({
      nombreDeJO: this.nombreDeJO,
      nombreDePays: this.nombreDePays,
      nombreDeParticipations: this.nombreDeParticipations,
      nombreDeMedailles: this.nombreDeMedailles,
      nombreAthletes: this.nombreAthletes,
    });
  } */

  // Calcul du nombre d'éditions uniques des JO
  private calculateNombreDeJO(): void {
    const years = new Set<number>();
    this.olympicsData.forEach((olympic) => {
      olympic.participations.forEach((participation) => {
        years.add(participation.year); // Ajouter les années uniques
      });
    });
    this.nombreDeJO = years.size; // Taille du Set = nombre d'éditions uniques
  }

  // Calcul du nombre de pays
  private calculateNombreDePays(): void {
    this.nombreDePays = this.olympicsData.length;
  }

  // Calcul du nombre total de participations
  private calculateNombreDeParticipations(): void {
    this.nombreDeParticipations = this.olympicsData.reduce(
      (total, olympic) => total + olympic.participations.length,
      0
    );
  }

  // Calcul du nombre total de médailles
  private calculateNombreDeMedailles(): void {
    this.nombreDeMedailles = this.olympicsData.reduce((total, olympic) => {
      return (
        total +
        olympic.participations.reduce(
          (sum, participation) => sum + participation.medalsCount,
          0
        )
      );
    }, 0);
  }

  // Calcul du nombre total d'athlètes
  private calculateNombreAthletes(): void {
    this.nombreAthletes = this.olympicsData.reduce((total, olympic) => {
      return (
        total +
        olympic.participations.reduce(
          (sum, participation) => sum + participation.athleteCount,
          0
        )
      );
    }, 0);
  }
}
