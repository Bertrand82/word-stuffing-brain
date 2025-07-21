import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
// TODO: Replace the path below with the actual path to BiLanguageWord
import { BiLanguageWord } from '../BiLangageWord';
import { parseLine,saveListWordsToLocalStorage2 } from '../word-stuffing-root';
@Component({
  selector: 'app-bg-file-system',
  imports: [CommonModule],
  templateUrl: './bg-file-system.html',
  styleUrl: './bg-file-system.css'
})
export class BgFileSystem {
  @Input() wordsArray: BiLanguageWord[] = [];
  @Output() wordsChange = new EventEmitter<BiLanguageWord[]>();

  fileName:string="";



    onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    this.fileName = file.name;
    console.log('Fichier sélectionné:', this.fileName);
    const reader = new FileReader();

    reader.onload = () => {
      const text = reader.result as string;

      var fileLinesArray = text.split(/[\r\n]+/); // découpe sur retours de ligne
      this.wordsArray = []; // Réinitialise le tableau des mots
      fileLinesArray.forEach((line, idx) => {
        console.log(`Ligne ${idx + 1}:`, line);
        const parsedWord = parseLine(line);
        if (parsedWord) {
          this.wordsArray.push(parsedWord);
        }
        // Vous pouvez ajouter ici votre méthode de traitement ligne par ligne
      });
      console.log("onFileSelected end ","Nb de mots "+this.wordsArray.length);
      saveListWordsToLocalStorage2(this.wordsArray);
      this.wordsChange.emit(this.wordsArray); // Émet le tableau de mots mis à jour
    };
    reader.readAsText(file);
  }

}
