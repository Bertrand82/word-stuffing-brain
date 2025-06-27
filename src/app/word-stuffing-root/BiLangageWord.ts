import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';


export class BiLanguageWord {
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
