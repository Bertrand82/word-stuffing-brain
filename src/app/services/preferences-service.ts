import { Injectable, OnInit } from '@angular/core';

const KEY_PREFERENCES_LOCAL_STORAGE_LANGAGE_TOLEARN = 'langage_to_learn';
const KEY_PREFERENCES_LOCAL_STORAGE_LANGAGE_LEARNER ='languageLearner'
@Injectable({
  providedIn: 'root'
})
export class PreferencesService {

  langageToLearn:string = languages[0].language;
  langageLearner:string = languages[1].language;

  constructor() { this.init(); }

  init(){
    const languageToLearn = localStorage.getItem(KEY_PREFERENCES_LOCAL_STORAGE_LANGAGE_TOLEARN);
    const languageLearner = localStorage.getItem(KEY_PREFERENCES_LOCAL_STORAGE_LANGAGE_LEARNER);
    if (languageToLearn) {
      console.log("parsedPreferences",languageToLearn);
      this.langageToLearn = languageToLearn ;
    }
    if(languageLearner){
      this.langageLearner=languageLearner;
    }

    console.log('PreferencesService initialized with:', this.langageToLearn, this.langageLearner);
  }

  savePreferences() {
    // Logic to save preferences, e.g., to local storage or a backend service
    console.log('Preferences saved object :', this);
    console.log('Preferences saved string :', JSON.stringify(this));
    localStorage.setItem(
      KEY_PREFERENCES_LOCAL_STORAGE_LANGAGE_TOLEARN,
      this.langageToLearn
    );
    localStorage.setItem(
      KEY_PREFERENCES_LOCAL_STORAGE_LANGAGE_LEARNER,
      this.langageLearner
    );
  }
}

export const languages = [
  { value: '1', label: 'English', language: 'en' },
  { value: '2', label: 'French', language: 'fr' },
  { value: '3', label: 'Spanish', language: 'es' },
  { value: '4', label: 'Italian', language: 'it' },
] as const;
