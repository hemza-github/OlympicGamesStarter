import { Component, OnInit } from '@angular/core';
import { OlympicService } from './core/services/olympic.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private olympicService: OlympicService) {}

  ngOnInit(): void {
    // Utilise la bonne méthode du service
    this.olympicService
      .getOlympicsData()
      .pipe(take(1))
      .subscribe((data) => {
        console.log('Data loaded:', data);
      });
  }
}
