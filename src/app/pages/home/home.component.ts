import { Component, OnInit } from '@angular/core';
import { OlympicService } from '../../core/services/olympic.service';
import { Olympic } from '../../core/models/Olympic';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  olympicsData: Olympic[] = []; // Contiendra les données récupérées
  public nombreDeJO: number = 0; // Nombre d'éditions uniques des JO
  public nombreDePays: number = 0; // Nombre de pays

  constructor(private olympicService: OlympicService) {}

  ngOnInit(): void {
    this.fetchOlympicsData();
  }

  fetchOlympicsData(): void {
    // Appel au service pour récupérer les données JSON
    this.olympicService.getOlympicsData().subscribe((data) => {
      this.olympicsData = data;
      this.calculateNombreDeJO();
      this.calculateNombreDePays();
    });
  }

  // Calcule le nombre d'éditions uniques des JO à partir des participations
  private calculateNombreDeJO(): void {
    const years = new Set<number>();
    this.olympicsData.forEach((olympic) => {
      olympic.participations.forEach((participation) => {
        years.add(participation.year);
      });
    });
    this.nombreDeJO = years.size;
    console.log('Nombre de JO uniques:', this.nombreDeJO);
  }

  // Calcule le nombre de pays (chaque élément représente un pays)
  private calculateNombreDePays(): void {
    this.nombreDePays = this.olympicsData.length;
    console.log('Nombre de pays:', this.nombreDePays);
  }
}
