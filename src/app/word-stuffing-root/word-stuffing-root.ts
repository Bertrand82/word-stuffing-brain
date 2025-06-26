import { Component } from '@angular/core';
import { NgIf } from '@angular/common';


@Component({
  selector: 'word-stuffing-root',
  imports: [],
  templateUrl: './word-stuffing-root.html',
  styleUrl: './word-stuffing-root.css'
})
export class WordStuffingRoot {

  protected fileName = 'words-english-brain-stuffing.txt';
  protected lineCurrent = 0;
  protected fileContent = '';
  fileLinesArray: string[] = [];
  biLangageWordsArray: BiLanguageWord[] = [];
  currentWord: BiLanguageWord | null = null;
  displayTraductionFlag = false;

  next() {
    this.lineCurrent--;
    if( this.lineCurrent < 0 ) {
      this.lineCurrent = this.biLangageWordsArray.length - 1;
    }
    this.processNextWord();
  }
  previous() {
    this.lineCurrent++;
    if( this.lineCurrent > this.biLangageWordsArray.length - 1 ) {
      this.lineCurrent = 0;
    }
    this.processNextWord();
  }
  processNextWord() {
    this.displayTraductionFlag = false;
     if(this.biLangageWordsArray.length > 0) {
      this.currentWord = this.biLangageWordsArray[this.lineCurrent];
    }
    console.log(   "next ligne "+this.lineCurrent,this.biLangageWordsArray[this.lineCurrent] );

  }

  displayTraduction() {
    this.displayTraductionFlag = true
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    this.fileName= file.name;
    console.log('Fichier sélectionné:', this.fileName);
    const reader = new FileReader();

    reader.onload = () => {
      const text = reader.result as string;
      this.fileLinesArray = text.split(/[\r\n]+/); // découpe sur retours de ligne
      this.fileLinesArray.forEach((line, idx) => {
        console.log(`Ligne ${idx + 1}:`, line);
        const parsedWord = parseLine(line);
        if (parsedWord) {
          this.biLangageWordsArray.push(parsedWord);
        }
        // Vous pouvez ajouter ici votre méthode de traitement ligne par ligne
      });
    };

    reader.readAsText(file);
  }


}

function parseLine(line: string):BiLanguageWord | null {
  const parts = line.split(':');
  if (parts.length !== 2) {
    return null; // Format invalide
  }
  const [key, value] = parts.map(part => part.trim());

  return new BiLanguageWord(key.trim(), value.trim());
}


class BiLanguageWord {
  constructor(
    public langageCible: string,
    public langageTraduction: string,
  ) {}

  // Exemple de méthode : affichage formaté
  toString(): string {
    return `${this.langageCible} → ${this.langageTraduction}`;
  }

  // Exemple : transformation en majuscules
  toUppercase(): void {
    this.langageCible= this.langageCible.toUpperCase();
    this.langageTraduction = this.langageTraduction.toUpperCase();
  }
}
