import { Component, Input } from '@angular/core';
import { OlympicService } from '../../core/services/olympic.service';
import { Statistics } from './../../core/models/Statistics';
import { Olympic } from '../../core/models/Olympic';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss'],
})
export class StatisticsComponent {
  @Input()
  stats: Statistics[] = []; // Les statistiques à afficher

  public olympicsData: Olympic[] = [];
  public nombreDeJO = 0;
  public nombreDePays = 0;
  public nombreDeParticipations = 0;
  public nombreDeMedailles = 0;
  public nombreAthletes = 0;

  constructor(private olympicService: OlympicService) {}

  ngOnInit(): void {
    this.fetchOlympicsData();
  }

  private fetchOlympicsData(): void {
    this.olympicService.getOlympicsData().subscribe((data) => {
      this.olympicsData = data;
      this.performCalculations();
    });
  }

  private performCalculations(): void {
    this.calculateNombreDeJO();
    this.calculateNombreDePays();
    this.calculateNombreDeParticipations();
    this.calculateNombreDeMedailles();
    this.calculateNombreAthletes();

    this.stats = [
      { label: 'Nombre de JO', value: this.nombreDeJO },
      { label: 'Nombre de Pays', value: this.nombreDePays },
      { label: 'Nombre de Participations', value: this.nombreDeParticipations },
      { label: 'Nombre de Médailles', value: this.nombreDeMedailles },
      { label: 'Nombre d’Athlètes', value: this.nombreAthletes },
    ];
  }

  private calculateNombreDeJO(): void {
    const years = new Set<number>();
    this.olympicsData.forEach((olympic) => {
      olympic.participations.forEach((participation) =>
        years.add(participation.year)
      );
    });
    this.nombreDeJO = years.size;
  }

  private calculateNombreDePays(): void {
    this.nombreDePays = this.olympicsData.length;
  }

  private calculateNombreDeParticipations(): void {
    this.nombreDeParticipations = this.olympicsData.reduce(
      (total, olympic) => total + olympic.participations.length,
      0
    );
  }

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
