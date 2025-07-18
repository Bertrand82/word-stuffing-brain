import { Component,ViewChild, Output, EventEmitter } from '@angular/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BiLanguageWord } from './BiLangageWord';

import { UtilVoice } from './util-voice/util-voice';
import { BgGoogleDrive } from './bg-google-drive/bg-google-drive';
import { BgGoogleTranslate } from './bg-google-translate/bg-google-translate';
import { BgGoogleChatGpt } from './bg-google-chat-gpt/bg-google-chat-gpt';
@Component({
  selector: 'word-stuffing-root',
  imports: [UtilVoice, CommonModule, FormsModule, BgGoogleDrive,BgGoogleTranslate,BgGoogleChatGpt],
  templateUrl: './word-stuffing-root.html',
  styleUrl: './word-stuffing-root.css',
})
export class WordStuffingRoot {

 @ViewChild(BgGoogleTranslate) BgGoogleTranslate!: BgGoogleTranslate;

onTokenChange($event: string) {
  this.token=$event;
}
onTraductionChange($event: Event) {
  console.warn('onTraductionChange', $event);
}

modeTraductionChange($event: MouseEvent) {
      this.displayTraductionFlag = $event.target instanceof HTMLInputElement ? $event.target.checked : false;

}


  protected fileName: string = 'No file selected';
  protected lineCurrent = 0;
  protected fileContent = '';
  text: string = 'hi , it is not an exercise .';

  isAutoPlay = false;
  fileLinesArray: string[] = [];
  biLangageWordsArray: BiLanguageWord[] = [];
  biLangageWordsArrayLocal: BiLanguageWord[] = [];
  currentWord: BiLanguageWord = new BiLanguageWord('Default', 'Defaut');
  token:string=""
  voice!: SpeechSynthesisVoice;
  rate: number = 1;
  volume: number = 1; // Volume de la parole (1 est le volume maximum)
  listWordsKey = 'biLangageWords';
  displayTraductionFlag= false;

  ngOnInit() {
    console.warn('word-stuffing-root ngOnInitA');
    this.loadWords();
    this.biLangageWordsArrayLocal.push
    this.biLangageWordsArray.push(...this.biLangageWordsArrayLocal);
  }
  setVoice(voice: SpeechSynthesisVoice) {
    this.voice = voice;
    console.warn('setVoice', this.voice);
  }

  setRate(rate: number) {
    this.rate = rate;
    console.warn('setRate', this.rate);
  }

    setVolume(volume: number) {
    this.volume = volume;
    console.warn('setVolume', this.volume);
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
      if (this.lineCurrent >= this.biLangageWordsArray.length) {
        this.lineCurrent = 0;
      }
      this.currentWord = this.biLangageWordsArray[this.lineCurrent];
      this.BgGoogleTranslate.reset();
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
      u.volume = this.volume; // Volume de la parole (1 est le volume maximum)

      u.onend = () => resolve();
      u.onerror = (err) => {
        console.error('Erreur synthèse vocale', err);
        resolve(); // ou reject(err);
      };

      speechSynthesis.speak(u);
    });
  }

  speak() {
    //this.saySync(this.text);
    this.currentWord = new BiLanguageWord(this.text, "");
    this.repeat();

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
    if (this.biLangageWordsArray.length > 0) {
      this.BgGoogleTranslate.reset();
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
    console.warn('say11 displayTraductionFlag', this.displayTraductionFlag);
    const utterance = new SpeechSynthesisUtterance(text);
    //utterance.lang = this.voice; // Vous pouvez changer la langue si nécessaire
    utterance.lang = 'en'; // Vous pouvez changer la langue si nécessaire
    console.warn('say2 voice', this.voice);
    utterance.voice = this.voice;
    console.warn('say3 rate', this.rate);
    utterance.rate = this.rate; // Vitesse de la parole (1 est la vitesse normale)
    utterance.volume = this.volume; // Volume de la parole (1 est le volume maximum)
    console.warn('say2', utterance);
    speechSynthesis.speak(utterance);
  }

  displayTraduction() {
    this.displayTraductionFlag = true;
  }

  onWordsArrayChanged(words: BiLanguageWord[]) {
    if (!Array.isArray(words))  {
      console.warn('onWordsArrayChanged: les mots ne sont pas un tableau valide');
      return;
    }
    if (words.length === 0) {
      console.warn('onWordsArrayChanged: le tableau de mots est vide');
      return;
    }

    this.biLangageWordsArray = words;
    console.warn('onWordsArrayChanged', this.biLangageWordsArray);
    this.lineCurrent = 0; // Réinitialise la ligne courante
    alert("New list of words \n "+words.length+" words")
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
      this.biLangageWordsArray = []; // Réinitialise le tableau des mots
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
    console.log('saveWord00 ', this.currentWord);
    console.log(
      'saveWordAA',
      Array.isArray(this.biLangageWordsArrayLocal),
      this.biLangageWordsArrayLocal
    );
    if(!Array.isArray(this.biLangageWordsArrayLocal)){
      this.biLangageWordsArrayLocal = Object.values(this.biLangageWordsArrayLocal);
    }
    const index = this.biLangageWordsArrayLocal.findIndex(
      (word) => word.langageCible === this.currentWord.langageCible
    );
    if (index !== -1) {
      // Si le mot existe déjà, on le remplace
      this.biLangageWordsArrayLocal[index] = this.currentWord;
    } else {
      this.biLangageWordsArrayLocal.push(this.currentWord);
    }
    localStorage.setItem(
      this.listWordsKey,
      JSON.stringify(this.biLangageWordsArrayLocal)
    );
  }

  loadWords() {
    const savedWords = localStorage.getItem(this.listWordsKey);
    console.log('loadWords', savedWords);
    if (savedWords) {
      this.biLangageWordsArrayLocal = JSON.parse(savedWords);
      console.log(
        'Mots chargés depuis le stockage local:',
        this.biLangageWordsArrayLocal
      );
    } else {
      console.warn('Aucun mot trouvé dans le stockage local.');
    }
  }

  cleanLocalStorage() {
    this.biLangageWordsArrayLocal = [];
    localStorage.setItem(
      this.listWordsKey,
      JSON.stringify(this.biLangageWordsArrayLocal)
    );
  }

  localStorage(){
    console.warn('localStorage', this.listWordsKey);
    console.warn('localStorage length', this.biLangageWordsArrayLocal.length);
    this.biLangageWordsArray = Object.values(this.biLangageWordsArrayLocal);
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
