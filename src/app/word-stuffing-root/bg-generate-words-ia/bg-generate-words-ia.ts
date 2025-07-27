import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GeminiService } from '../../services/gemini';
import { Observable } from 'rxjs';
import { BiLanguageWord } from '../BiLangageWord';
import { PreferencesService } from '../../services/preferences-service';

@Component({
  selector: 'app-bg-generate-words-ia',
  imports: [FormsModule],
  templateUrl: './bg-generate-words-ia.html',
  styleUrl: './bg-generate-words-ia.css',
})
export class BgGenerateWordsIA {
  theme: string = 'beer';
  level: string = 'advanced';
  wordCount: number = 20;
  isProcessing: boolean = false;
  isHttpOK: boolean = false;
  httpStatus: string = '';
  response: string = '';
  biLangageWordsArray: BiLanguageWord[] = [];
  preferencesService: PreferencesService;

   @Output() wordsChange = new EventEmitter<BiLanguageWord[]>();
  constructor(
    private gemini: GeminiService,
    preferencesService2: PreferencesService
  ) {
    this.preferencesService = preferencesService2;
  }

  generateWords() {
    const responseSchema = {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          word: {
            type: 'string',
            description:
              'a word related to the theme "' +
              this.theme +
              '" in language ' +
              this.preferencesService.langageToLearn,
          },
          traduction: {
            type: 'string',
            description:
              'a traduction of the word in language ' +
              this.preferencesService.langageLearner,
          },
          exampleWord: {
            type: 'string',
            description:
              'a sentence using the word in language ' +
              this.preferencesService.langageToLearn,
          },
          traductionExampleWord: {
            type: 'string',
            description:
              'a traduction of the exampleWord in language ' +
              this.preferencesService.langageLearner,
          },
        },
        required: [
          'word',
          'traduction',
          'exampleWord',
          'traductionExampleWord',
        ],
      },
    };
    const promptTemplate: string = `generate ${this.wordCount} words related to the theme ${this.theme} at level ${this.level}, and for each one gives an example of how the word is used in a simple sentence.`;
    const prompt = '' + promptTemplate;
    this.isProcessing = true;
    this.isHttpOK = false;

    console.log('Generating words using AI. theme:', this.theme);
    console.log('Generating words using AI. prompt :', prompt);
    console.log(
      'Generating words using AI. responseSschema  :',
      responseSchema
    );
    this.gemini.generateContent(prompt, responseSchema).subscribe({
      next: (res) => {
        this.isProcessing = false;
        this.isHttpOK = true;
        this.httpStatus = res.status;
        console.log('status', this.httpStatus);
        console.log('responseRequest', res);
        console.log('candidates', res.candidates);
        const candidat = res.candidates[0];

        console.log('candidat', candidat);
        const content = candidat.content;
        console.log('content ', content);
        const parts = content.parts;
        const part0 = parts[0];
        console.log('part0', part0);
        const text = part0.text;
        console.log('text: ', text);
        const obj = JSON.parse(text);

        this.biLangageWordsArray = this.toBilanguageWordsArray(obj);
        this.wordsChange.emit(this.biLangageWordsArray);
        console.log('biLangageWordsArray:', this.biLangageWordsArray);
        this.alertOnResult();
      },
      error: (err) => {
        this.isProcessing = false;
        this.isHttpOK = false;
        console.log('responseRequest err', err);
        this.httpStatus = err.status;
        console.log('err status', this.httpStatus);
        this.response = 'Erreur : ' + err.message;
      },
    });
  }
  alertOnResult() {
    console.log('Words generated successfully.');
    var alertStr = 'Words generated successfully:\n';
    alertStr += 'Theme: ' + this.theme + '\n';
  }

  toBilanguageWordsArray(obj: any): BiLanguageWord[] {
    const wordsArray: BiLanguageWord[] = [];
    console.log("obj is array :"+Array.isArray(obj));
    if (Array.isArray(obj)) {
      obj.forEach((item: any) => {
          const biLangageWord1 = new BiLanguageWord(item.word, item.traduction);
          const biLangageWord2 = new BiLanguageWord(
            item.exampleWord,
            item.traductionExampleWord
          );
          wordsArray.push(biLangageWord1);
          wordsArray.push(biLangageWord2);

      });
    } else {
      console.error('Invalid response format:', obj);
    }
    console.log("wordsArray",wordsArray)
    return wordsArray;
  }
}
