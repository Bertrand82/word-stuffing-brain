
import { environment_secret } from './../../environments/environment_secret';


import { Injectable, NgZone } from '@angular/core';





export declare namespace google.accounts.oauth2 {
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

@Injectable({
  providedIn: 'root',
})
export class BgGoogleServiceAuth {
  scopes = [
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/translate',
    'https://www.googleapis.com/auth/cloud-platform',
    'https://www.googleapis.com/auth/cloud-translation',
    ''
    // 'https://www.googleapis.com/auth/generative-language'
  ];
  scopeParam = this.scopes.join(' ');
  public token: string | null = null;

  files: any[] = []; // Liste des fichiers récupérés depuis Google Drive

  constructor(private zone: NgZone) {
    console.log('bg BgGoogleServiceAuth constructor');
  }

  private clientGoogle!: google.accounts.oauth2.TokenClient;





  signInSynchrone(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Crée un nouveau TokenClient avec le callback désiré
      const tempClient = google.accounts.oauth2.initTokenClient({
        client_id: environment_secret.client_id,
        scope: this.scopeParam,
        callback: (resp: any) => {
          if (resp.error) {
            return reject(resp);
          }
          console.log('Token obtenu :', resp.access_token);
          this.token = resp.access_token;
          //this.tokenChange.emit(this.token ?? undefined);
          resolve();
        },
      });
      // Lance le flow silencieux ou interactif selon besoin
      tempClient.requestAccessToken();
    });
  }

  getBgClient(): google.accounts.oauth2.TokenClient{
    console.log('bg getBgClient clientGoogle :'+this.clientGoogle);
    if (!this.clientGoogle) {
      console.log('bg getBgClient client_id :'+environment_secret.client_id);
      this.clientGoogle=  google.accounts.oauth2.initTokenClient({
      client_id: environment_secret.client_id,
      scope: this.scopeParam,
      callback: (tokenResponse) => {
        this.zone.run(() => {
          console.log('Token reçu A acessToken', tokenResponse.access_token);
          console.log('Token reçu B tokenReponse', tokenResponse);
          // stocker ou émettre l'access_token
          this.token = tokenResponse.access_token;
          //this.tokenChange.emit(this.token ?? undefined);
          console.log('listDriveFiles', '----');

        });
      },
    })
    }
    return this.clientGoogle;
  }

  signInGoogleDrive() {
    console.warn('bg signInGoogleDrive');
    this.getBgClient().requestAccessToken(); // popup silencieux
    console.log('ClientId', environment_secret.client_id);
   
  }



}
