import ServiceOpenRouterIdentification, { handleCallback } from './../../services/service-open-router-identification';
import { Component, OnInit } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-callback',
  template: `<p>{{ etat }}</p><p *ngIf="!ok"> <button (click)="navigateToRoot()">go to root</button></p>`,
  imports: [CommonModule],
  standalone: true,
})
export class CallbackComponent implements OnInit {

  etat: string = 'Authentification openRouter En cours...';
  ok :boolean = true;
  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private serviceOpenRouter: ServiceOpenRouterIdentification,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    handleCallback()
      .then((data) => {
        this.ok=true;



        this.etat = 'Authentification OpenRouter réussie !';
        this.cd.detectChanges(); // Force la détection des changement s

        this.router.navigate(['/']);
      })
      .catch((error) => {
        this.ok=false;
        this.etat = 'Erreur lors de l\'authentification OpenRouter :'+error.message;
         this.cd.detectChanges(); // Force la détection des changements

        console.error('Erreur lors du traitement du callback:', error);
        // Gérer l'erreur selon vos besoins, par exemple rediriger vers une page d'erreur
      } );
  }

  navigateToRoot() {
    this.router.navigate(['/']);
  }
}


