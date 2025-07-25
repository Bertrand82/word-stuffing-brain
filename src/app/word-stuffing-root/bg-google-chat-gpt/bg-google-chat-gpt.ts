import { environment } from './../../../environments/environment';

import { Component, Input, Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { GeminiService } from './../../../app/services/gemini';
import { VoiceRecognitionService } from './../../../app/services/voice-recognition';

@Component({
  selector: 'app-bg-google-chat-gpt',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './bg-google-chat-gpt.html',
  styleUrl: './bg-google-chat-gpt.css',
})
export class BgGoogleChatGpt {
  @Input() token: string = '';
  userInput = new FormControl('');
  sentence: string = 'This is a sentence for checking';

  prompt: string = 'How are you ai ?';
  response: string = '';
  isSentenceOK: boolean = false;
  isHttpOK = false;
  isProcessing = false;
  urlGemini = environment.geminiApiUrl;
  httpStatus: string = '';
  corrected: string = '';
  isMakeSens: boolean = false;
  isFamiliar: boolean = false;
  nbOfFaults: number = 0;
  otherCorrectProposition: string = '';
  isRecording: boolean = false;

  constructor(
    private gemini: GeminiService,
    public voiceRecognitionService: VoiceRecognitionService
  ) {}

  ngOnInit() {
    this.voiceRecognitionService.init();
  }

  checkSentenceByChatGpt() {
    console.log('checkSentenceByChatGpt sentence :', this.userInput.value);
    //

    // "Analyze the following sentence: 'He went to the market yesterday.' Is the sentence grammatically correct? Answer only 'Yes' or 'No'. If the answer is 'No,' suggest a corrected version of the sentence."
    this.prompt =
      'is the following sentence is correct: "' + this.userInput.value + '"';
    this.prompt =
      'Analyze the following sentence: "' +
      this.userInput.value +
      '" ' +
      "Is the sentence OK ? . If the answer is 'KO' suggest a corrected version of the sentence.";
    console.log('checkSentenceByChatGpt prompt :', this.prompt);
    this.corrected = '';
    this.isProcessing = true;
    this.ask();
  }

  ask(): void {
    this.gemini.generateContent(this.prompt).subscribe({
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
        console.log('isOk:', obj.isOK);
        this.isSentenceOK = obj.isOK;
        this.corrected = obj.corrected;
        this.isFamiliar = obj.isFamiliar;
        this.isMakeSens = obj.isMakeSens;
        this.nbOfFaults = obj.numberOfFaults;
        console.log('isMakeSens:', obj.isMakeSens);
        console.log('isFamiliar:', obj.isFamiliar);
        console.log('corrected:', obj.corrected);
        this.response = text;
        this.otherCorrectProposition = obj.otherCorrectProposition;
        this.alertOnResult();
      },
      error: (err) => {
        this.isProcessing = false;
        this.isHttpOK = false;
        console.log('responseRequest', err);
        this.httpStatus = err.status;
        console.log('status', this.httpStatus);
        this.response = 'Erreur : ' + err.message;
      },
    });
  }
  alertOnResult() {
    var alertStr = ' is Ok :' + this.isSentenceOK + '\n';
    alertStr += ' is Familiar : ' + this.isFamiliar + '\n ';
    alertStr += 'make sens : ' + this.isMakeSens + ' \n ';
    alertStr += 'sentence : ' + this.userInput.value + ' \n ';
    alertStr += 'Nb of errors :' + this.nbOfFaults + '\n';
    alertStr += 'correct sentence: ' + this.corrected + '\n';
    alertStr += 'Other proposition : ' + this.otherCorrectProposition;
    alert(alertStr);
  }

  startRecording() {
    try {
      console.log('ProcessMicro Start recording');
      this.isRecording = true;
      this.voiceRecognitionService.start();
    } catch (error) {
      console.error('Error starting voice recognition:', error);
      let errorMessage = 'Unknown error';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      alert('Error starting voice recognition: ' + errorMessage);
    }
  }
  stopRecording() {
    console.log('ProcessMicro stop recording');
    this.voiceRecognitionService.stop();
    this.isRecording = false;
    var message = this.voiceRecognitionService.text;
    this.userInput.setValue(message);
    console.log('message ' + message);
  }
}
