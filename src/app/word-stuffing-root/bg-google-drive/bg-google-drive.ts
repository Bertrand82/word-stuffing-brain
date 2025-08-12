import { BgGoogleChatGpt } from './../bg-google-chat-gpt/bg-google-chat-gpt';
import { environment } from './../../../environments/environment';
import { environment_secret } from './../../../environments/environment_secret';
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
import {
  parseLine,
  toWordsArray,
  saveListWordsToLocalStorage2,
  toStringWordsContent,
} from '../word-stuffing-root';
import { BgGoogleDriveService } from '../../services/bg-google-drive-service';
import { BgGoogleServiceAuth } from '../../services/bg-google-service-auth';



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



  constructor(private zone: NgZone,protected bgGoogleServiceAuth: BgGoogleServiceAuth,protected bgGoogleDriveService: BgGoogleDriveService) {

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

  listDriveFiles() {
         var q = `'root' in parents and trashed = false and mimeType = 'text/plain'`;
         this.bgGoogleDriveService.listDriveFiles3(q);
  }
  bgCheckShare() {
    var q = `'root' in parents and trashed = false and mimeType = 'text/plain'`;
    q = "sharedWithMe and trashed = false and mimeType='text/plain' ";
    this.bgGoogleDriveService.listDriveFiles3(q);
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
      `list of ${this.wordsArray.length} items \nEnter the file name:`,
      'vocabulary'
    );
    this.bgGoogleDriveService.createTxtFile(
      'root', // ou un ID de dossier spécifique
      fileName + '.txt', // nom du fichier
      textContent // contenu du fichier
    );
  }



  bgDisplayFile(fileId: string) {
    console.log('Display', fileId);
    if (!this.bgGoogleServiceAuth.token) {
      console.error('Aucun token disponible pour afficher le fichier');
      return;
    }
    const url = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`;
    fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.bgGoogleServiceAuth.token}`,
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
        saveListWordsToLocalStorage2(this.wordsArray);
      })
      .catch((error) => {
        console.error("Erreur lors de l'affichage du fichier:", error);
      });
  }
  environmentBg = environment;
  handlePickBg($event: Event) {
    throw new Error('Method not implemented.');
  }







  columns = ['nom', 'email', 'role'];
  rows = [
    { nom: 'Alice', email: 'alice@example.com', role: 'Admin' },
    { nom: 'Bob', email: 'bob@example.com', role: 'User' },
    // ...
  ];





}
