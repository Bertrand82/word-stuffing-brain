import { environment } from './../../../environments/environment';
import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core';

import { Injectable, NgZone } from '@angular/core';
//import { GoogleDrivePicker } from '@googleworkspace/drive-picker-element'; // Si vous utilisez un élément personnalisé
import { CommonModule } from '@angular/common';
import { BiLanguageWord } from '../BiLangageWord';

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
  @Input() wordsArray: BiLanguageWord[] = [];
  @Output() wordsChange = new EventEmitter<BiLanguageWord[]>();
  @Output() tokenChange = new EventEmitter<string>();

  scopes = [
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/translate',
    'https://www.googleapis.com/auth/cloud-platform',
    'https://www.googleapis.com/auth/cloud-translation',
   // 'https://www.googleapis.com/auth/generative-language'

  ];
  scopeParam = this.scopes.join(' ');

  constructor(private zone: NgZone) {
    this.client = google.accounts.oauth2.initTokenClient({
      client_id: environment.clientId,
      scope: this.scopeParam,
      callback: (tokenResponse) => {
        this.zone.run(() => {
          console.log('Token reçu A acessToken', tokenResponse.access_token);
          console.log('Token reçu B tokenReponse', tokenResponse);
          // stocker ou émettre l'access_token
          this.token = tokenResponse.access_token;
          this.tokenChange.emit(this.token ?? undefined);
          console.log('listDriveFiles', '----');
          this.listDriveFiles(); // on liste immédiatement
        });
      },
    });
  }
  // stocker ou émettre l'access_token
  bgViewContentFile(item: any) {
    console.log('bgViewContentFile', item);
    if (!item.webContentLink) {
      console.error('No webContentLink available for this file');
      alert('No content link available for this file');
      return;
    }
    const url = item.webViewLink;
    window.open(url, '_blank'); // Ouvre le lien dans un nouvel onglet
  }
  bgDetailFile(item: any) {
    console.log('bgDetailFile', item);
    var text = `Name: ${item.name}\n`;
    text += `ID: ${item.id}\n`;
    text += `MIME Type: ${item.mimeType}\n`;
    text += `Created Time: ${item.createdTime}\n`;
    text += `Modified Time: ${item.modifiedTime}\n`;
    text += `Size: ${item.size ? item.size + ' bytes' : 'Unknown'}\n`;
    text += `Shared With Me Time: ${
      item.sharedWithMeTime ? item.sharedWithMeTime : 'Not shared'
    }\n`;
    text += `Web View Link: ${
      item.webViewLink ? item.webViewLink : 'No link available'
    }\n`;
    text += `Web Content Link: ${
      item.webContentLink ? item.webContentLink : 'No content link available'
    }\n`;
    text += `Owners: ${item.owners
      .map((owner: any) => owner.emailAddress)
      .join(', ')}\n`;
    console.log('bgDetailFile text', text);
    alert(text);
  }

  bgCheckShare() {
    var q = `'root' in parents and trashed = false and mimeType = 'text/plain'`;
    q = "sharedWithMe and trashed = false and mimeType='text/plain' ";
    this.listDriveFiles3(q);
  }
  bgShareFile(fileId: string) {
    console.log('bgShareFile', fileId);
    if (!this.token) {
      console.error('Aucun token disponible pour partager le fichier');
      return;
    }
    const email = prompt('Enter the email: ');
    if (email === null || email.trim() === '') {
      console.error('Aucun email fourni pour partager le fichier'); // Vérification si l'email est vide
      alert('No email provided to share the file'); // Alerte si l'email est vide
      return; // Sortir si l'email est vide
    }
    const url = `https://www.googleapis.com/drive/v3/files/${fileId}/permissions`;
    const body = {
      role: 'reader', // ou 'writer' selon vos besoins
      type: 'user', // ou 'user', 'group', etc.
      emailAddress: email, // Remplacez par l'adresse e-mail du destinataire
    };

    fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }
        console.log('Fichier partagé avec succès');
        alert('File shared successfully');
      })
      .catch((error) => {
        console.error('Erreur lors du partage du fichier:', error);
        alert(`Error sharing file: ${error.message}`);
      });
  }
  bgCleanName(fullName: string) {
    if (!fullName) {
      return '--';
    }
    // Nettoyer le nom du fichier en supprimant les caractères spéciaux
    const cleanedName = fullName.replace('.txt', '');
    return cleanedName;
  }

  bgRenameFileInDrive(id: any) {
    console.log('Rename', id);
    if (!this.token) {
      console.error('Aucun token disponible pour renommer le fichier');
      return;
    }
    const newName = prompt('Enter the new file name: ');
    if (!newName) {
      console.error('Aucun nom fourni pour renommer le fichier');
      return;
    }

    fetch(`https://www.googleapis.com/drive/v3/files/${id}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${this.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: newName }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }
        console.log('Fichier renommé avec succès');
        this.listDriveFiles(); // Rafraîchir la liste des fichiers
      })
      .catch((error) => {
        console.error('Erreur lors du renommage du fichier:', error);
      });
  }

  bgDeleteFileInDrive(id: string) {
    console.log('Delete', id);
    if (!this.token) {
      console.error('Aucun token disponible pour supprimer le fichier');
      return;
    }
    fetch(`https://www.googleapis.com/drive/v3/files/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${this.token}`,
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }
        console.log('Fichier supprimé avec succès');
        this.removeFileFromList(id); // Supprimer le fichier de la liste locale
      })
      .catch((error) => {
        console.error('Erreur lors de la suppression du fichier:', error);
      });
  }

  removeFileFromList(id: string) {
    console.log('removeFileFromList', id);
    this.files = this.files.filter((file) => file.id !== id);
    console.log('Updated files list:', this.files);
  }

  bgDisplayFile(fileId: string) {
    console.log('Display', fileId);
    if (!this.token) {
      console.error('Aucun token disponible pour afficher le fichier');
      return;
    }
    const url = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`;
    fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.token}`,
        'Content-Type': 'text/plain',
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }
        return response.text(); // Récupère le contenu du fichier
      })
      .then((content) => {
        console.log('Contenu du fichier:', content);
        this.wordsArray = toWordsArray(content);
        console.log('wordsArray', this.wordsArray);
        this.wordsChange.emit(this.wordsArray); // Émet le tableau de mots mis à jour
      })
      .catch((error) => {
        console.error("Erreur lors de l'affichage du fichier:", error);
      });
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
    if (!this.wordsArray || this.wordsArray.length === 0) {
      console.error('Aucun mot à sauvegarder');
      alert('No words to save');
      return;
    }
    var textContent = toStringWordsContent(this.wordsArray);
    const fileName = prompt(
      'list of ' +
        this.wordsArray.length +
        ' items \n' +
        'Enter the file name:',
      'vocabulary'
    );
    this.createTxtFile(
      'root', // ou un ID de dossier spécifique
      fileName + '.txt', // nom du fichier
      textContent // contenu du fichier
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

  signInSynchrone(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Crée un nouveau TokenClient avec le callback désiré
      const tempClient = google.accounts.oauth2.initTokenClient({
        client_id: environment.clientId,
        scope: this.scopeParam,
        callback: (resp: any) => {
          if (resp.error) {
            return reject(resp);
          }
          console.log('Token obtenu :', resp.access_token);
          this.token = resp.access_token;
          this.tokenChange.emit(this.token ?? undefined);
          resolve();
        },
      });
      // Lance le flow silencieux ou interactif selon besoin
      tempClient.requestAccessToken();
    });
  }

  signIn() {
    this.client.requestAccessToken(); // popup silencieux
    console.log('ClientId', environment.clientId);
    console.log('developer-key', environment.apiKey);
  }

  private listDriveFiles(folderId: string | null = 'root') {
    var q = `'${folderId}' in parents and trashed = false and mimeType = 'text/plain'`;
    console.log('folder id:', folderId);
    this.listDriveFiles3(q);
  }
  private listDriveFiles3(q: string) {
    if (!this.token) {
      console.error('Aucun token disponible');
      alert('No token available');
      return;
    }
    // Requête "q" pour filtrer les fichiers non corbeille dans le dossier donné
    //old const q = `'${folderId}' in parents and trashed = false`;

    //const q = `'${folderId}' in parents and trashed = false and isAppAuthorized=true`;//Vous ne pouvez donc que filtrer sur parents et trashed :

    console.log('Query:', q);
    // Paramètres encodés pour l'URL
    const params = new URLSearchParams({
      q,
      fields:
        'files(id,name,mimeType,parents,sharedWithMeTime, owners,permissions,webViewLink,webContentLink,createdTime,modifiedTime,size)',
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
        alert(`Error retrieving files: ${error.message}`);
      });
  }

  private async createTxtFile(
    folderId: string = 'root',
    fileName: string,
    content: string
  ) {
    if (!fileName || fileName.trim().length === 0) {
      console.error('Invalid file name provided use default');
      fileName = 'vocabularyDefault.txt'; // Default name if none provided
    }
    if (!this.token) {
      console.error(
        'No token available to create the file: Appel de bgCheckDrive'
      );
      await this.signInSynchrone();
    }
    if (!this.token) {
      console.error(
        'Aucun token disponible pour créer le fichier: echec de la sauvegarde'
      );
      alert('No token available to create the file');
      return;
    }

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
    alert(`File created successfully with ID: ${data.id}`);
    this.listDriveFiles(); // Rafraîchir la liste des fichiers
    return data;
  }
}
function toStringWordsContent(wordsArray: BiLanguageWord[]) {
  console.log('toStringWordsContent', wordsArray);
  if (!Array.isArray(wordsArray)) {
    console.error('Invalid input: wordsArray is not an array');
    return '  Invalid input wordsArray is not an array   ';
  }
  if (wordsArray.length === 0) {
    console.warn('Warning: wordsArray is empty');
    return '  Empty wordsArray   ';
  }
  const content = wordsArray
    .map((word) => `${word.langageCible} : ${word.langageTraduction}`)
    .join('\n');
  console.log('toStringWordsContent content', content);
  return content;
}

function toWordsArray(text: string): BiLanguageWord[] {
  var fileLinesArray = text.split(/[\r\n]+/); // découpe sur retours de ligne
  var wordsArray: BiLanguageWord[] = [];
  fileLinesArray.forEach((line, idx) => {
    console.log(`Ligne ${idx + 1}:`, line);
    const parsedWord = parseLine(line);
    if (parsedWord) {
      wordsArray.push(parsedWord);
    }
  });
  return wordsArray;
}

function parseLine(line: string): BiLanguageWord | null {
  const parts = line.split(':');
  if (parts.length < 2) {
    if (!line || line.trim().length === 0) {
      return null; // Ligne vide ou invalide
    }
    return new BiLanguageWord(line.trim(), ''); // Format invalide
  }
  const [key, value] = parts.map((part) => part.trim());

  return new BiLanguageWord(key.trim(), value.trim());
}
