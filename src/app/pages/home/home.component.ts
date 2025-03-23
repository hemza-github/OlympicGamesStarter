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

  constructor(private olympicService: OlympicService) {}

  ngOnInit(): void {
    this.fetchOlympicsData();
  }

  fetchOlympicsData(): void {
    // Appel au service pour récupérer les données JSON
    this.olympicService.getOlympicsData().subscribe((data) => {
      this.olympicsData = data;
    });
  }
}
