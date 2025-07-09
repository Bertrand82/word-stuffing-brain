import { Component } from '@angular/core';
import { Injectable, NgZone } from '@angular/core';
import { environment } from '../../../environments/environment';

declare namespace google.accounts.oauth2 {
  interface TokenClientConfig {
    client_id: string;
    scope: string;
    callback: (response: TokenResponse) => void;
  }

  interface TokenResponse {
    access_token: string;
    expires_in: number;
    // Ajoutez d'autres propriétés si nécessaire
  }

  function initTokenClient(config: TokenClientConfig): TokenClient;

  interface TokenClient {
    requestAccessToken(): void;
  }
}

@Component({
  selector: 'app-bg-google-drive',
  imports: [],
  templateUrl: './bg-google-drive.html',
  standalone: true,
  styleUrl: './bg-google-drive.css',
})
@Injectable({ providedIn: 'root' })
export class BgGoogleDrive {
  bgCheckDrive() {
    console.log('Check Drive');
    this.signIn();
  }
  private client: google.accounts.oauth2.TokenClient;

  constructor(private zone: NgZone) {
    this.client = google.accounts.oauth2.initTokenClient({
      client_id: environment.clientId,
      scope: 'https://www.googleapis.com/auth/drive.readonly',
      callback: (tokenResponse) => {
        this.zone.run(() => {
          console.log('Token reçu', tokenResponse.access_token);
          // stocker ou émettre l'access_token
        });
      },
    });
  }

  signIn() {
    this.client.requestAccessToken(); // popup silencieux
  }
}


