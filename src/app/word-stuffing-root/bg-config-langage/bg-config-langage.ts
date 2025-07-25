import { Component, EventEmitter, Output } from '@angular/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PreferencesService, languages } from '../../services/preferences-service';

@Component({
  selector: 'app-bg-config-langage',
  imports: [CommonModule, FormsModule],
  templateUrl: './bg-config-langage.html',
  styleUrl: './bg-config-langage.css',
})
export class BgConfigLangage {
  @Output() languageChange2 = new EventEmitter<string>();



  constructor(private preferencesService: PreferencesService) {
    this.selectedOptionLangageToLearn = this.preferencesService.langageToLearn;
    this.selectedOptionLangageLearner = this.preferencesService.langageLearner;
    this.options = languages;
  }

  selectedOptionLangageToLearn ;
  selectedOptionLangageLearner;
  options:any;

  onModelChangeLangageLearner(language: any) {
    console.log('onModelChangeLangageLearner1', language);
    this.preferencesService.langageLearner = language;
    this.preferencesService.savePreferences();
  }

  onModelChangeLangageToLearn(language: any) {
    console.log('onModelChangeLangageToLearn  AAAAAAAAAA', language);
    this.preferencesService.langageToLearn = language;
    this.preferencesService.savePreferences();
    console.log('onModelChangeLangageToLearn  BBBBBBBBBB', language);
    this.languageChange2.emit("language333");
    console.log('onModelChangeLangageToLearn  CCCCCCCCC', language);
  }
}
