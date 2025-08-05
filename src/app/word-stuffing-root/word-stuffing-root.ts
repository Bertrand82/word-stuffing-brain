import { PreferencesService } from './../services/preferences-service';
import {
  Component,
  ViewChild,
  Output,
  EventEmitter,
  ChangeDetectorRef,
} from '@angular/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BiLanguageWord } from './BiLangageWord';
import { BgLogin } from './bg-login/bg-login';
import { OpenRouterListModels } from './open-router-list-models/open-router-list-models';
import { OpenRouterChatJson } from './open-router-chat-json/open-router-chat-json';
import { UtilVoice } from './util-voice/util-voice';
import { BgGoogleDrive } from './bg-google-drive/bg-google-drive';
import { BgGoogleTranslate } from './bg-google-translate/bg-google-translate';
import { BgGoogleChatGpt } from './bg-google-chat-gpt/bg-google-chat-gpt';
import { BgFileSystem } from './bg-file-system/bg-file-system';
import { BgConfigLangage } from './bg-config-langage/bg-config-langage';
import { BgGenerateWordsIA } from './bg-generate-words-ia/bg-generate-words-ia';

interface MenuItem {
  id: string;
  label: string;
  visible: boolean;
}

@Component({
  selector: 'word-stuffing-root',
  imports: [
    UtilVoice,
    CommonModule,
    FormsModule,
    BgGoogleDrive,
    BgGoogleTranslate,
    BgGoogleChatGpt,
    BgFileSystem,
    BgConfigLangage,
    BgGenerateWordsIA,
    BgLogin,
    OpenRouterListModels,
    OpenRouterChatJson,
  ],
  templateUrl: './word-stuffing-root.html',
  styleUrl: './word-stuffing-root.css',
})
export class WordStuffingRoot {
  @ViewChild(BgGoogleTranslate) BgGoogleTranslate!: BgGoogleTranslate;
  @ViewChild(UtilVoice) utilVoice!: UtilVoice;

  protected fileName: string = '';
  protected lineCurrent = 0;
  protected fileContent = '';
  protected isLoading = true;
  text: string = 'hi , it is not an exercise .';

  isAutoPlay = false;
  fileLinesArray: string[] = [];
  biLangageWordsArray: BiLanguageWord[] = [];
  biLangageWordsArrayLocal: BiLanguageWord[] = [];
  currentWord: BiLanguageWord = new BiLanguageWord('Default', 'Defaut');
  token: string = '';
  voice!: SpeechSynthesisVoice;
  rate: number = 1;
  volume: number = 1; // Volume de la parole (1 est le volume maximum)

  displayTraductionFlag = true;
  displayTraductionFlagTemp = false;

  preferencesService: PreferencesService;
  public static readonly KEY_LOCAL_STORAGE: string = 'biLangageWords';

  constructor(
    PreferencesService: PreferencesService,
    private cd: ChangeDetectorRef
  ) {
    this.preferencesService = PreferencesService;
  }

  ngOnInit() {
    console.warn('word-stuffing-root ngOnInitA');
    this.loadWords();
    this.biLangageWordsArrayLocal.push;
    this.biLangageWordsArray.push(...this.biLangageWordsArrayLocal);
    this.isLoading = false;
    this.menuItems.push({
      id: 'keyOpenRouter',
      label: 'Key Open Router',
      visible: false,
    });
    this.menuItems.push({ id: 'fileSystem', label: 'File', visible: false });
    this.menuItems.push({
      id: 'googleDrive',
      label: 'Google Drive',
      visible: false,
    });
    this.menuItems.push({
      id: 'translation',
      label: 'Translation',
      visible: false,
    });
    this.menuItems.push({
      id: 'googleTranslate',
      label: 'Google Translate',
      visible: false,
    });
    this.menuItems.push({
      id: 'googleChatGpt',
      label: 'Google Chat Gpt',
      visible: false,
    });
    this.menuItems.push({
      id: 'chatOpenRouterJson',
      label: 'Chat OpenRouter',
      visible: false,
    });
    this.menuItems.push({
      id: 'configurationLanguage',
      label: 'Language ',
      visible: false,
    });
    this.menuItems.push({
      id: 'voiceConfiguration',
      label: 'Voice ',
      visible: false,
    });
    this.menuItems.push({
      id: 'generateWordsIA',
      label: 'Generate Words IA',
      visible: false,
    });
    this.menuItems.push({
      id: 'openRouterChoiceModel',
      label: 'model OpenRouter',
      visible: false,
    });


    console.warn('word-stuffing-root ngOnInitB');
    this.utilVoice.loadVoices();
    this.utilVoice.checkselectedVoiceIsInVoices();
  }

  ngAfterContentInit() {
    console.warn('word-stuffing-root ngAfterContentInit');
    this.cd.detectChanges(); // Force la détection des changements
  }

  onTokenChange($event: string) {
    this.token = $event;
  }
  onTraductionChange($event: Event) {
    console.warn('onTraductionChange', $event);
  }

  modeTraductionChange($event: MouseEvent) {
    this.displayTraductionFlag =
      $event.target instanceof HTMLInputElement ? $event.target.checked : false;
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

  async onIsAutoPlayChange(value: boolean): Promise<void> {
    this.isAutoPlay = value;
    // Tant que isAutoPlay est à true, on attend un délai entre chaque 'next()'
    while (this.isAutoPlay) {
      this.lineCurrent--;
      this.displayTraductionFlagTemp = false;
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
    this.currentWord = new BiLanguageWord(this.text, '');
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
    this.displayTraductionFlagTemp = false;
    if (this.biLangageWordsArray.length > 0) {
      if (this.BgGoogleTranslate) {
        this.BgGoogleTranslate.reset();
      }

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
    utterance.lang = this.preferencesService.langageToLearn; // Vous pouvez changer la langue si nécessaire
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
    if (!Array.isArray(words)) {
      console.warn(
        'onWordsArrayChanged: les mots ne sont pas un tableau valide'
      );
      return;
    }
    if (words.length === 0) {
      console.warn('onWordsArrayChanged: le tableau de mots est vide');
      return;
    }

    this.biLangageWordsArray = words;
    console.warn('onWordsArrayChanged', this.biLangageWordsArray);
    this.lineCurrent = 0; // Réinitialise la ligne courante
    this.saveListWordsToLocalStorage();
    alert('New list of words \n ' + words.length + ' words');
  }

  saveWord() {
    console.log('saveWord00 ', this.currentWord);
    console.log(
      'saveWordAA',
      Array.isArray(this.biLangageWordsArrayLocal),
      this.biLangageWordsArrayLocal
    );
    if (!Array.isArray(this.biLangageWordsArrayLocal)) {
      this.biLangageWordsArrayLocal = Object.values(
        this.biLangageWordsArrayLocal
      );
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
      WordStuffingRoot.KEY_LOCAL_STORAGE,
      JSON.stringify(this.biLangageWordsArrayLocal)
    );
  }

  loadWords() {
    const savedWords = localStorage.getItem(WordStuffingRoot.KEY_LOCAL_STORAGE);
    console.log('loadWords  :', savedWords);
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
      WordStuffingRoot.KEY_LOCAL_STORAGE,
      JSON.stringify(this.biLangageWordsArrayLocal)
    );
  }

  saveListWordsToLocalStorage() {
    console.warn(
      'saveListWordsToLocalStorage localStorage key',
      WordStuffingRoot.KEY_LOCAL_STORAGE
    );
    this.biLangageWordsArrayLocal = this.biLangageWordsArray;
    localStorage.setItem(
      WordStuffingRoot.KEY_LOCAL_STORAGE,
      JSON.stringify(this.biLangageWordsArrayLocal)
    );
    console.warn(
      'saveListWordsToLocalStorage localStorage done',
      'biLangageWordsArray :' + this.biLangageWordsArray.length
    );
    console.warn(
      'saveListWordsToLocalStorage localStorage done',
      'biLangageWordsArrayLocal : ' + this.biLangageWordsArrayLocal.length
    );
  }

  localStorage() {
    console.warn('localStorage', WordStuffingRoot.KEY_LOCAL_STORAGE);
    console.warn('localStorage length', this.biLangageWordsArrayLocal.length);
    this.biLangageWordsArray = Object.values(this.biLangageWordsArrayLocal);
  }

  onLanguageChange2($event: String) {
    console.log('XXXXXXXXXXXXX onLanguageChange2', $event);
    this.utilVoice.loadVoices();
    this.utilVoice.checkselectedVoiceIsInVoices();
  }
  menuItems: MenuItem[] = [];
  menuItemSelected: MenuItem = {
    id: '',
    label: '',
    visible: false,
  };
  toggleMenu(id: string) {
    const item = this.menuItems.find((it) => it.id === id);
    if (item) {
      this.menuItemSelected = item;
    }
  }
  isComponentVisible(id: string): boolean {
    return this.menuItemSelected.id === id;
  }
}

export function parseLine(line: string): BiLanguageWord | null {
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

export function saveListWordsToLocalStorage2(biLangageWords: BiLanguageWord[]) {
  console.warn(
    'saveListWordsToLocalStorage localStorage key',
    WordStuffingRoot.KEY_LOCAL_STORAGE
  );

  localStorage.setItem(
    WordStuffingRoot.KEY_LOCAL_STORAGE,
    JSON.stringify(biLangageWords)
  );
  console.warn(
    'saveListWordsToLocalStorage2 localStorage done',
    'biLangageWords :' + biLangageWords.length
  );
}

export function toWordsArray(text: string): BiLanguageWord[] {
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

export function toStringWordsContent(wordsArray: BiLanguageWord[]) {
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
