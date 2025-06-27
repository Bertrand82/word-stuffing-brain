import  { Component, Output, EventEmitter } from '@angular/core';
import { BiLanguageWord } from './BiLangageWord';
import { CommonModule } from '@angular/common';
import { UtilVoice } from './util-voice/util-voice';
@Component({
  selector: 'word-stuffing-root',
  imports: [UtilVoice, CommonModule],
  templateUrl: './word-stuffing-root.html',
  styleUrl: './word-stuffing-root.css'
})
export class WordStuffingRoot {

  protected fileName: string = 'No file selected';
  protected lineCurrent = 0;
  protected fileContent = '';
  fileLinesArray: string[] = [];
  biLangageWordsArray: BiLanguageWord[] = [];
  currentWord: BiLanguageWord | null = null;
  displayTraductionFlag = false;
  voice!: SpeechSynthesisVoice;
  rate:number=1;

  setVoice(voice: SpeechSynthesisVoice) {
    this.voice = voice;
    console.warn('setVoice', this.voice);
  }

  setRate(rate: number) {
    this.rate = rate;
    console.warn('setRate', this.rate);
  }

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
  repeat(){
    console.warn('repeat', this.currentWord);
    if (this.currentWord) {
      this.say(this.currentWord.langageCible);
    }
  }

  processNextWord() {
    this.displayTraductionFlag = false;
     if(this.biLangageWordsArray.length > 0) {
      this.currentWord = this.biLangageWordsArray[this.lineCurrent];
      this.say(this.currentWord.langageCible);
    }
    console.log(   "next ligne "+this.lineCurrent,this.biLangageWordsArray[this.lineCurrent] );

  }

  say(text: string) {
    if (!text || text.trim().length === 0) {
      console.warn('Texte vide ou invalide pour la synthèse vocale');
      return;
    }
    console.warn('say1',text);
    const utterance = new SpeechSynthesisUtterance(text);
   //utterance.lang = this.voice; // Vous pouvez changer la langue si nécessaire
    utterance.lang = "en"; // Vous pouvez changer la langue si nécessaire
     console.warn('say2 voice',this.voice);
    utterance.voice = this.voice;
    console.warn('say3 rate',this.rate);
    utterance.rate = this.rate; // Vitesse de la parole (1 est la vitesse normale)

    console.warn('say2',utterance);
    speechSynthesis.speak(utterance);
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
  if (parts.length < 2) {

    if (!line || line.trim().length === 0){
      return null; // Ligne vide ou invalide
    }
    return new BiLanguageWord(line.trim(), ''); // Format invalide
  }
  const [key, value] = parts.map(part => part.trim());

  return new BiLanguageWord(key.trim(), value.trim());
}



