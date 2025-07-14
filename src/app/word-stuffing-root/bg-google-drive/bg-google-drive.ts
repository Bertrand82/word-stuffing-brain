import { environment } from './../../../environments/environment';
import {
  Component,
  ViewChild,
  ElementRef,
  CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core';
import { Injectable, NgZone } from '@angular/core';
//import { GoogleDrivePicker } from '@googleworkspace/drive-picker-element'; // Si vous utilisez un élément personnalisé
import { CommonModule } from '@angular/common';

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
  imports: [CommonModule],
  templateUrl: './bg-google-drive.html',
  standalone: true,
  styleUrl: './bg-google-drive.css',
})
@Injectable({ providedIn: 'root' })
export class BgGoogleDrive {

bgDelete(id: string) {
   console.log('Delete', id);
}

bgDisplay(id: string) {
   console.log('Display', id);
}
  environmentBg = environment;
  handlePickBg($event: Event) {
    throw new Error('Method not implemented.');
  }

  bgCheckDrive() {
    console.log('Check Drive');
    this.signIn();
  }
  bgSaveVocabulaire() {
    console.log('Save Vocabulaire');
    this.createTxtFile(
      'root', // ou un ID de dossier spécifique
      'vocabulaire.txt', // nom du fichier
      'Contenu du vocabulaire bg' // contenu du fichier
    );
  }
  private client: google.accounts.oauth2.TokenClient;
  private token: string | null = null;
  files: any[] = []; // Liste des fichiers récupérés depuis Google Drive
  columns = ['nom', 'email', 'role'];
  rows = [
    { nom: 'Alice', email: 'alice@example.com', role: 'Admin' },
    { nom: 'Bob', email: 'bob@example.com', role: 'User' },
    // ...
  ];

  constructor(private zone: NgZone) {
    this.client = google.accounts.oauth2.initTokenClient({
      client_id: environment.clientId,
      scope: 'https://www.googleapis.com/auth/drive',
      callback: (tokenResponse) => {
        this.zone.run(() => {
          console.log('Token reçu A acessToken', tokenResponse.access_token);
          console.log('Token reçu B tokenReponse', tokenResponse);
          // stocker ou émettre l'access_token
          this.token = tokenResponse.access_token;
          console.log('listDriveFiles', '----');
          this.listDriveFiles(); // on liste immédiatement
        });
      },
    });
  }

  signIn() {
    this.client.requestAccessToken(); // popup silencieux
    console.log('ClientId', environment.clientId);
    console.log('developer-key', environment.apiKey);
  }

  private listDriveFiles(folderId: string | null = 'root') {
    console.log('folder id:', folderId);
    if (!this.token) {
      console.error('Aucun token disponible');
      return;
    }
    // Requête "q" pour filtrer les fichiers non corbeille dans le dossier donné
    //old const q = `'${folderId}' in parents and trashed = false`;
    const q = `'${folderId}' in parents and trashed = false and mimeType = 'text/plain'`;
    //const q = `'${folderId}' in parents and trashed = false and isAppAuthorized=true`;//Vous ne pouvez donc que filtrer sur parents et trashed :

    console.log('Query:', q);
    // Paramètres encodés pour l'URL
    const params = new URLSearchParams({
      q,
      fields: 'files(id,name,mimeType,parents)',
      pageSize: '100',
    }).toString();
    console.log('Params:', params);
    // Appel GET à l'API Drive avec le token dans l'entête
    fetch(`https://www.googleapis.com/drive/v3/files?${params}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.token}`,
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        console.log('Response:', response);
        // Vérification de la réponse HTTP
        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log('Fichiers récupérés A:', data.files);
        this.files = data.files || [];
        console.log('Fichiers récupérés B:', this.files);
      })
      .catch((error) => {
        console.error('Erreur lors de la récupération des fichiers:', error);
      });
  }

  private async createTxtFile(
    folderId: string = 'root',
    fileName: string,
    content: string
  ) {
    if (!this.token) throw new Error('Aucun token disponible');

    const metadata = {
      name: fileName,
      parents: [folderId],
      mimeType: 'text/plain',
    };
    const form = new FormData();
    form.append(
      'metadata',
      new Blob([JSON.stringify(metadata)], { type: 'application/json' })
    );
    form.append('file', new Blob([content], { type: 'text/plain' }));

    const url =
      'https://www.googleapis.com/upload/drive/v3/files' +
      '?uploadType=multipart' +
      '&supportsAllDrives=true';

    const res = await fetch(url, {
      method: 'POST',
      headers: { Authorization: `Bearer ${this.token}` },
      body: form,
    });
    console.log('Response:', res);
    console.log('Response.status:', res.status);
    //if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
    const data = await res.json();
    console.log('data:', data);
    console.log('Fichier .txt créé avec ID:', data.id);
    return data;
  }
}
