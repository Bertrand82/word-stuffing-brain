
import { CommonModule } from '@angular/common';
import ServiceOpenRouterIdentification, { handleCallback } from './../../services/service-open-router-identification';
import { Component ,ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-bg-login',
  imports: [CommonModule,
    FormsModule],
  templateUrl: './bg-login.html',
  styleUrl: './bg-login.css',
})
export class BgLogin {

  apiKey!: string ;
  userId!: string;


  serviceOpenRouter: ServiceOpenRouterIdentification
apiKeyManuel: any;

  constructor(serviceOpenRouter: ServiceOpenRouterIdentification) {
    this.serviceOpenRouter = serviceOpenRouter;
    console.log('BgLogin component initialized ',serviceOpenRouter);
    const urlParams = new URLSearchParams(window.location.search);


  }

  displayKeyAndUserId() {
  this.apiKey = localStorage.getItem('apiKey') || 'no API Key';
  this.userId = localStorage.getItem('userId') || 'no User ID';
  this.apiKeyManuel = this.apiKey;
    console.log('API Key:', this.apiKey);
    console.log('User ID:', this.userId);
}


  protected fetchKeyOnOpenServeur() {
    console.log('Login2 button clicked');
    this.serviceOpenRouter.startAuth();
  }


  saveKeyManual() {
    console.log('Save Key button clicked');
    this.apiKeyManuel = this.apiKeyManuel.trim();
    if (this.apiKeyManuel) {
      localStorage.setItem('apiKey', this.apiKeyManuel);
      this.serviceOpenRouter.apiKey = this.apiKeyManuel;
      console.log('API Key saved manually:', this.apiKeyManuel);
      this.displayKeyAndUserId();
    }
  }


} /////////////////////////////////////////////////////////////

