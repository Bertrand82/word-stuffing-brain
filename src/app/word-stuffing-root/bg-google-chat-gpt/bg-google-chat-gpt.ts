import { environment } from './../../../environments/environment';
import { Component, Input, Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { GeminiService } from './../../../app/services/gemini'
@Component({
  selector: 'app-bg-google-chat-gpt',
  imports: [ CommonModule,
    ReactiveFormsModule],
  templateUrl: './bg-google-chat-gpt.html',
  styleUrl: './bg-google-chat-gpt.css',
})
export class BgGoogleChatGpt {
  @Input() token: string = '';
  userInput = new FormControl('');
  sentence: string = 'This is a sentence for checking';

  prompt: string = "How are you ai ?";
  response: string='';
  urlGemini = environment.geminiApiUrl;



  constructor(private gemini: GeminiService) {}

  ask(): void {
    this.gemini.generateContent(this.prompt).subscribe({
      next: res => {
        console.log("responseRequest",res);
        console.log("candidates",res.candidates);
        const candidat = res.candidates[0];

        console.log("candidat",candidat);
        const content = candidat.content;
        console.log("content ",content);
        const parts = content.parts;
        const part0 = parts[0];
        console.log("part0",part0);
        const text = part0.text;
        console.log("text",text);
        this.response = text;
      },
      error: err => {
        console.log("responseRequest",err);
        const status = err.status;
        console.log("status",status)
        this.response = 'Erreur : ' + err.message}
    });
  }
  checkSentenceByChatGpt() {
    console.log('checkSentenceByChatGpt sentence :', this.userInput.value);
    this.prompt = "is the following sentence is correct: \""+this.userInput.value+"\""
    console.log('checkSentenceByChatGpt prompt :', this.prompt);
    this.ask();
  }


}
