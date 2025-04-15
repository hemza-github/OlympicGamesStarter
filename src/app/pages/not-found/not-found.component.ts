import { Component, OnInit } from '@angular/core'; // Import des hooks de cycle de vie Angular
import { Router } from '@angular/router'; // Import du service Router pour la navigation

@Component({
  selector: 'app-not-found', // Sélecteur du composant
  templateUrl: './not-found.component.html', // Chemin vers le fichier HTML
  styleUrls: ['./not-found.component.scss'], // Chemin vers les styles SCSS
})
export class NotFoundComponent implements OnInit {
  constructor(private router: Router) {} // Injection du service Router

  /**
   * Hook appelé à l'initialisation du composant.
   * Actuellement, aucun traitement spécifique n'est effectué à l'initialisation.
   */
  ngOnInit(): void {}

  /**
   * Navigue vers la page d'accueil lorsque l'utilisateur clique sur le bouton "Retour".
   */
  goBack(): void {
    this.router.navigate(['']); // Redirige vers la page d'accueil
  }
}
