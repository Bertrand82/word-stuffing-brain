import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-bg-generate-words-ia',
  imports: [FormsModule],
  templateUrl: './bg-generate-words-ia.html',
  styleUrl: './bg-generate-words-ia.css',
})
export class BgGenerateWordsIA {

  theme: string = 'plaisanterie';
  level: string = 'easy';
  wordCount: number = 20;

  generateWords() {
    console.log('Generating words using AI...');
    alert(`Generating ${this.wordCount} words with theme "${this.theme}" at level "${this.level}".`);
  }
}
