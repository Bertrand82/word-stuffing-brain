import { Component, Output, EventEmitter } from '@angular/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BiLanguageWord } from './BiLangageWord';

import { UtilVoice } from './util-voice/util-voice';
@Component({
  selector: 'word-stuffing-root',
  imports: [UtilVoice, CommonModule, FormsModule],

  templateUrl: './word-stuffing-root.html',
  styleUrl: './word-stuffing-root.css',
})
export class WordStuffingRoot {
  protected fileName: string = 'No file selected';
  protected lineCurrent = 0;
  protected fileContent = '';
  isAutoPlay = false;
  fileLinesArray: string[] = [];
  biLangageWordsArray: BiLanguageWord[] = [];
  currentWord: BiLanguageWord | null = null;
  displayTraductionFlag = false;
  voice!: SpeechSynthesisVoice;
  rate: number = 1;

  setVoice(voice: SpeechSynthesisVoice) {
    this.voice = voice;
    console.warn('setVoice', this.voice);
  }

  setRate(rate: number) {
    this.rate = rate;
    console.warn('setRate', this.rate);
  }

  onIsAutoPlayChange_old(value: boolean): void {
    this.isAutoPlay = value;
    while (this.isAutoPlay) {
      this.next();
    }
  }
  async onIsAutoPlayChange(value: boolean): Promise<void> {
    this.isAutoPlay = value;
    // Tant que isAutoPlay est à true, on attend un délai entre chaque 'next()'
    while (this.isAutoPlay) {
      this.lineCurrent--;
      if (this.lineCurrent < 0) {
        this.lineCurrent = this.biLangageWordsArray.length - 1;
      }
      this.currentWord = this.biLangageWordsArray[this.lineCurrent];

      await this.saySync(this.currentWord.langageCible);
      await this.sleep(1000); // ici, délai de 1 seconde (1000 ms)
    }
  }

  //////////////

  saySync(text: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!text?.trim()) {
        console.warn('Texte vide ou invalide pour la synthèse vocale');
        resolve();
        return;
      }
      const u = new SpeechSynthesisUtterance(text);
      u.lang = this.voice?.lang ?? 'en';
      u.voice = this.voice;
      u.rate = this.rate;

      u.onend = () => resolve();
      u.onerror = (err) => {
        console.error('Erreur synthèse vocale', err);
        resolve(); // ou reject(err);
      };

      speechSynthesis.speak(u);
    });
  }

  // Fonction utilitaire pour dormir un certain temps
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  next() {
    this.lineCurrent--;
    if (this.lineCurrent < 0) {
      this.lineCurrent = this.biLangageWordsArray.length - 1;
    }
    this.processNextWord();
  }
  previous() {
    this.lineCurrent++;
    if (this.lineCurrent > this.biLangageWordsArray.length - 1) {
      this.lineCurrent = 0;
    }
    this.processNextWord();
  }
  repeat() {
    console.warn('repeat', this.currentWord);
    if (this.currentWord) {
      this.say(this.currentWord.langageCible);
    }
  }

  processNextWord() {
    this.displayTraductionFlag = false;
    if (this.biLangageWordsArray.length > 0) {
      this.currentWord = this.biLangageWordsArray[this.lineCurrent];
      this.say(this.currentWord.langageCible);
    }
    console.log(
      'next ligne ' + this.lineCurrent,
      this.biLangageWordsArray[this.lineCurrent]
    );
  }

  say(text: string) {
    if (!text || text.trim().length === 0) {
      console.warn('Texte vide ou invalide pour la synthèse vocale');
      return;
    }
    console.warn('say1', text);
    const utterance = new SpeechSynthesisUtterance(text);
    //utterance.lang = this.voice; // Vous pouvez changer la langue si nécessaire
    utterance.lang = 'en'; // Vous pouvez changer la langue si nécessaire
    console.warn('say2 voice', this.voice);
    utterance.voice = this.voice;
    console.warn('say3 rate', this.rate);
    utterance.rate = this.rate; // Vitesse de la parole (1 est la vitesse normale)

    console.warn('say2', utterance);
    speechSynthesis.speak(utterance);
  }

  displayTraduction() {
    this.displayTraductionFlag = true;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    this.fileName = file.name;
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

  saveWord() {
    console.log('saveWord no implemented yet', this.currentWord);
    localStorage.setItem('biLangageWords', JSON.stringify(this.currentWord));
  }
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
