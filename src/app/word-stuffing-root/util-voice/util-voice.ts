import { Component,OnInit,Output, EventEmitter  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';  // ← Ajoutez cette ligne
@Component({
  selector: 'app-util-voice',
  imports: [
    FormsModule, CommonModule],
  templateUrl: './util-voice.html',
  styleUrl: './util-voice.css'
})
export class UtilVoice {
voices: SpeechSynthesisVoice[] = [];
 public selectedVoiceName!: SpeechSynthesisVoice;
 @Output() valeurEnvoyee = new EventEmitter<SpeechSynthesisVoice>();
  text: string = 'hi , it is an exercise .';

  ngOnInit() {
    console.warn('UtilVoice ngOnInit');
    this.loadVoices();
    window.speechSynthesis.onvoiceschanged = () => this.loadVoices();
  }

  onVoiceChange(newValue: SpeechSynthesisVoice) {
    //this.selectedVoiceName = newValue;
    console.warn('UtilVoice onVoiceChange', newValue);
    console.warn('UtilVoice onVoiceChange name', newValue.name);
    console.warn('UtilVoice onVoiceChange lang', newValue.lang);
    this.valeurEnvoyee.emit(this.selectedVoiceName);
  }

  loadVoices() {
    console.warn('UtilVoice loadVoices');
    this.voices = window.speechSynthesis.getVoices().filter(voice =>
      voice.lang.startsWith('en')
);
    console.warn('UtilVoice loadVoices2', this.voices);
    if (this.voices.length > 0 && !this.selectedVoiceName) {
      this.selectedVoiceName = this.voices[0];
      console.warn('UtilVoice loadVoices3', this.selectedVoiceName);
      this.valeurEnvoyee.emit(this.selectedVoiceName);
    }
  }

  speak() {
    const utterance = new SpeechSynthesisUtterance(this.text);
    console.warn('UtilVoice speak1', this.text, this.selectedVoiceName.lang);
    console.warn('UtilVoice speak2',  this.selectedVoiceName);
    console.warn('UtilVoice speak3 lang',  this.selectedVoiceName.lang);
    console.warn('UtilVoice speak4 name',  this.selectedVoiceName.name);
     // Vous pouvez changer la langue si nécessaire
    if (this.selectedVoiceName) {
      utterance.lang = this.selectedVoiceName.lang;
      utterance.voice = this.selectedVoiceName;
    }
    window.speechSynthesis.speak(utterance);
  }

  toString2(){
    return "UtilVoice: selected :"+this.selectedVoiceName ;
  }
}
