import { CommonModule } from '@angular/common';
import ServiceOpenRouterIdentification, {
  handleCallback,
} from './../../services/service-open-router-identification';
import { Component, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-bg-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './bg-login.html',
  styleUrl: './bg-login.css',
})
export class BgLogin {
  apiKey!: string;
  userId!: string;

  serviceOpenRouter: ServiceOpenRouterIdentification;
  apiKeyManuelOpenRouter: any;
  apiKeyManuelGemini: any;

  constructor(serviceOpenRouter: ServiceOpenRouterIdentification) {
    this.serviceOpenRouter = serviceOpenRouter;
    console.log('BgLogin component initialized ', serviceOpenRouter);
    const urlParams = new URLSearchParams(window.location.search);
  }

  displayKeyAndUserId() {
    this.apiKey = localStorage.getItem('apiKey') || 'no API Key';
    this.userId = localStorage.getItem('userId') || 'no User ID';
    this.apiKeyManuelOpenRouter = this.apiKey;
    console.log('API Key:', this.apiKey);
    console.log('User ID:', this.userId);
  }

  protected fetchKeyOnOpenServeur() {
    console.log('Login2 button clicked');
    this.serviceOpenRouter.startAuth();
  }

  saveKeyManualOpenServer() {
    console.log('Save Key button clicked');
    this.apiKeyManuelOpenRouter = this.apiKeyManuelOpenRouter.trim();
    if (this.apiKeyManuelOpenRouter) {
      localStorage.setItem('apiKey', this.apiKeyManuelOpenRouter);
      this.serviceOpenRouter.apiKey = this.apiKeyManuelOpenRouter;
      console.log('API Key saved manually:', this.apiKeyManuelOpenRouter);
      this.displayKeyAndUserId();
    }
  }

  saveKeyManualGemini() {
     console.log('saveKeyManualGemini');

     if (this.apiKeyManuelGemini) {
      this.apiKeyManuelGemini = this.apiKeyManuelGemini.trim();
      localStorage.setItem('apiKeyGemini', this.apiKeyManuelGemini);

      console.log('apiKeyGemini Key saved manually:', this.apiKeyManuelGemini);
      this.displayKeyAndUserId();
    }
  }
} /////////////////////////////////////////////////////////////
