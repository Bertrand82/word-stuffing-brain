import { Injectable, OnInit } from '@angular/core';

const KEY_PREFERENCES_LOCAL_STORAGE = 'preferences_local_storage';

@Injectable({
  providedIn: 'root'
})
export class PreferencesService {

  langageToLearn = languages[0].language;
  langageLearner = languages[1].language;

  constructor() { this.init(); }

  init(){
    const preferences = localStorage.getItem(KEY_PREFERENCES_LOCAL_STORAGE);
    if (preferences) {
      const parsedPreferences = JSON.parse(preferences);
      this.langageToLearn = parsedPreferences.langageToLearn || this.langageToLearn;
      this.langageLearner = parsedPreferences.langageLearner || this.langageLearner;
    } else {
      this.savePreferences();
    }
    console.log('PreferencesService initialized with:', this.langageToLearn, this.langageLearner);
  }

  savePreferences() {
    // Logic to save preferences, e.g., to local storage or a backend service
    console.log('Preferences saved:', this);
    console.log('Preferences saved:', JSON.stringify(this));
    localStorage.setItem(
      KEY_PREFERENCES_LOCAL_STORAGE,
      JSON.stringify(this)
    );
  }
}

export const languages = [
  { value: '1', label: 'English', language: 'en' },
  { value: '2', label: 'French', language: 'fr' },
  { value: '3', label: 'Spanish', language: 'es' },
  { value: '4', label: 'Italian', language: 'it' },
] as const;
