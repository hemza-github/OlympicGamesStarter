import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Olympic } from '../models/Olympic';

@Injectable({
  providedIn: 'root', // Rend le service disponible globalement
})
export class OlympicService {
  // Chemin relatif pour accéder au fichier JSON dans les assets
  private dataUrl = 'assets/mock/olympic.json';

  constructor(private http: HttpClient) {}

  /**
   * Récupère les données des Jeux Olympiques via un appel HTTP.
   * @returns Observable contenant une liste d'Olympic
   */
  getOlympicsData(): Observable<Olympic[]> {
    return this.http.get<Olympic[]>(this.dataUrl);
  }
}
