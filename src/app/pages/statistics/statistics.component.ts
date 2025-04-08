import { Component, Output, EventEmitter } from '@angular/core';
import { OlympicService } from '../../core/services/olympic.service';
import { Olympic } from '../../core/models/Olympic';
import { Chart, registerables } from 'chart.js';
import { Router } from '@angular/router';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss'], // Correction pour "styleUrls" au lieu de "styleUrl"
})
export class StatisticsComponent {
  @Output() dataReady = new EventEmitter<{
    nombreDeJO: number;
    nombreDePays: number;
  }>();

  public olympicsData: Olympic[] = []; // Contiendra les données récupérées
  public nombreDeJO: number = 0; // Nombre d'éditions uniques des JO
  public nombreDePays: number = 0; // Nombre de pays

  constructor(private olympicService: OlympicService, private router: Router) {}

  ngOnInit(): void {
    this.fetchOlympicsData(); // Récupérer les données
  }

  // Méthode pour récupérer les données
  fetchOlympicsData(): void {
    this.olympicService.getOlympicsData().subscribe((data) => {
      this.olympicsData = data;
      this.calculateNombreDeJO();
      this.calculateNombreDePays();

      // Émettre les données prêtes
      this.dataReady.emit({
        nombreDeJO: this.nombreDeJO,
        nombreDePays: this.nombreDePays,
      });
    });
  }

  // Calcule le nombre d'éditions uniques des JO
  private calculateNombreDeJO(): void {
    const years = new Set<number>();
    this.olympicsData.forEach((olympic) => {
      olympic.participations.forEach((participation) => {
        years.add(participation.year);
      });
    });
    this.nombreDeJO = years.size;
  }

  // Calcule le nombre de pays (chaque élément représente un pays)
  private calculateNombreDePays(): void {
    this.nombreDePays = this.olympicsData.length;
  }
}
