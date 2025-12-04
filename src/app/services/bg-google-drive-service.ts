import { BgGoogleServiceAuth } from './bg-google-service-auth';
import { environment } from './../../environments/environment';
import { environment_secret } from './../../environments/environment_secret';
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

import { BiLanguageWord } from './../../app/word-stuffing-root/BiLangageWord';
import {
  parseLine,
  toWordsArray,
  saveListWordsToLocalStorage2,
  toStringWordsContent,
} from '../../app/word-stuffing-root/word-stuffing-root';



@Injectable({
  providedIn: 'root',
})
export class BgGoogleDriveService {


  files: any[] = []; // Liste des fichiers récupérés depuis Google Drive

  constructor(private zone: NgZone,private bgGoogleServiceAuth: BgGoogleServiceAuth) {
    console.log('bg BgGoogleDriveService constructor');
  }



  public listDriveFiles(folderId: string | null = 'root') {
    var q = `'${folderId}' in parents and trashed = false and mimeType = 'text/plain'`;
    console.log('folder id:', folderId);
    this.listDriveFiles3(q);
  }
  public listDriveFiles3(q: string) {
    if (!this.bgGoogleServiceAuth.token) {
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
        Authorization: `Bearer ${this.bgGoogleServiceAuth.token}`,
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





  signInGoogleDrive___OLD() {
    console.warn('signInGoogleDrive');
    this.bgGoogleServiceAuth.getBgClient().requestAccessToken(); // popup silencieux
    console.log('ClientId', environment_secret.client_id);
    
  }

  async createTxtFile(
    folderId: string = 'root',
    fileName: string,
    content: string
  ) {
    if (!fileName || fileName.trim().length === 0) {
      console.error('Invalid file name provided use default');
      fileName = 'vocabularyDefault.txt'; // Default name if none provided
    }
    if (!this.bgGoogleServiceAuth.token) {
      console.error(
        'No token available to create the file: Appel de bgCheckDrive'
      );
      await this.bgGoogleServiceAuth.signInSynchrone();
    }
    if (!this.bgGoogleServiceAuth.token) {
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
      headers: { Authorization: `Bearer ${this.bgGoogleServiceAuth.token}` },
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



  removeFileFromList(id: string) {
    console.log('removeFileFromList', id);
    this.files = this.files.filter((file) => file.id !== id);
    console.log('Updated files list:', this.files);
  }

  bgDeleteFileInDrive(id: string) {
    console.log('Delete', id);
    if (!this.bgGoogleServiceAuth.token) {
      console.error('Aucun token disponible pour supprimer le fichier');
      return;
    }
    fetch(`https://www.googleapis.com/drive/v3/files/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${this.bgGoogleServiceAuth.token}`,
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

  bgRenameFileInDrive(id: any) {
    console.log('Rename', id);
    if (!this.bgGoogleServiceAuth.token) {
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
        Authorization: `Bearer ${this.bgGoogleServiceAuth.token}`,
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

  bgCleanName(fullName: string) {
    if (!fullName) {
      return '--';
    }
    // Nettoyer le nom du fichier en supprimant les caractères spéciaux
    const cleanedName = fullName.replace('.txt', '');
    return cleanedName;
  }


  bgShareFile(fileId: string) {
      console.log('bgShareFile', fileId);
      if (!this.bgGoogleServiceAuth.token) {
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
          Authorization: `Bearer ${this.bgGoogleServiceAuth.token}`,
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

}
