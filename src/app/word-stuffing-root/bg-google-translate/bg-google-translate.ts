import { Component, Input, Output, EventEmitter } from '@angular/core';
import { BiLanguageWord } from '../BiLangageWord';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './../../../environments/environment';

@Component({
  selector: 'app-bg-google-translate',
  imports: [],
  templateUrl: './bg-google-translate.html',
  styleUrl: './bg-google-translate.css'
})
export class BgGoogleTranslate {

  @Input() currentWord: BiLanguageWord = new BiLanguageWord('En', 'Fr')   ;
  @Input() token: string = '';
   wordTranslated: string = '';

  @Output() wordsChange = new EventEmitter<BiLanguageWord>();


  //constructor(private http: HttpClient) {}

  reset() {
    console.log("reset");
    this.wordTranslated="";
  }
 private translateBg(text: string, sourceLang: string, targetLang: string) {
  const projectId='wordtrainingbg';// Voir dans la console google le nom du projet
  console.log("projectId ",projectId);
  const url = `https://translation.googleapis.com/v3/projects/${projectId}:translateText`;
  console.log("url ",url)
  console.log("translateBg token ",this.token);
  console.log("translateBg token length",this.token.length);
  console.log("translateBg text"+text+" sourceLang "+sourceLang+" targetLang:"+targetLang);
  if(!this.token || this.token.length==0){
    alert("No token\n please connect")
  }
  const body = {
    sourceLanguageCode: sourceLang,
    targetLanguageCode: targetLang,
    contents: [text],
    mimeType: 'text/plain',
  };

  fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${this.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
    .then(async (response) => {
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Erreur HTTP ${response.status}  ${errorText}`);
      }else {
        console.log('Réponse de la traduction reçue:', response);

        const  jsonResponse = await response.json();
        console.log("jsonResponse :",jsonResponse)
        const translations: any[] = jsonResponse.translations;
        console.log("jsonResponse translations :",translations)
       console.log("jsonResponse translations length:",translations.length)
       if (translations.length > 0){
        const translation = translations[0];
        console.log("tanslation:",translation);
        this.wordTranslated = translation.translatedText;
        console.log ("translatedText" ,this.wordTranslated);

       }
      }

    })
    .catch((error) => {
      console.error('Erreur lors de la traduction :', error);

    });
}


  translateCurrentWord() {
    console.warn('translateCurrentWord', this.currentWord);
    // Simulate a translation process
    this.translateBg(this.currentWord.langageCible,"En","Fr");

}
}
