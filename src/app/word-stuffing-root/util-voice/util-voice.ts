import { Component,OnInit,Output, EventEmitter,ChangeDetectorRef, AfterViewInit   } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';  // ← Ajoutez cette ligne
@Component({
  selector: 'app-util-voice',
  standalone: true,
  // Note: 'standalone: true' is used for Angular 14+ to indicate that this component is a standalone component.
  // If you are using an older version of Angular, you can remove this line and use
  imports: [FormsModule, CommonModule],

  templateUrl: './util-voice.html',
  styleUrl: './util-voice.css'
})
export class UtilVoice {

  constructor(private cdr2: ChangeDetectorRef) {}
  voices: SpeechSynthesisVoice[] = [];
  public selectedVoiceName!: SpeechSynthesisVoice;
  @Output() valeurEnvoyee = new EventEmitter<SpeechSynthesisVoice>();
  text: string = 'hi , it is an exercise .';

  ngOnInit() {
    console.warn('UtilVoice ngOnInitA');
    this.voices = window.speechSynthesis.getVoices();
    console.warn('UtilVoice ngOnInitB', this.voices);
    console.warn('UtilVoice ngOnInitC', this.voices);

    window.speechSynthesis.onvoiceschanged = () => this.loadVoices();


     this.valeurEnvoyee.emit(this.selectedVoiceName);
  }


  onVoiceChange(newValue: SpeechSynthesisVoice) {
    //this.selectedVoiceName = newValue;
    console.warn('UtilVoice onVoiceChange', newValue);
    console.warn('UtilVoice onVoiceChange name', newValue.name);
    console.warn('UtilVoice onVoiceChange lang', newValue.lang);
    this.valeurEnvoyee.emit(this.selectedVoiceName);
  }

  loadVoices() {
    console.warn('UtilVoice loadVoicesA');
    this.voices = window.speechSynthesis.getVoices().filter(voice =>
      voice.lang.startsWith('en')
    );

     if (this.voices.length > 0 && !this.selectedVoiceName) {
      this.selectedVoiceName = this.voices[0];
      console.warn('UtilVoice loadVoicesAAAAAA', this.selectedVoiceName);
     // this.cdr.markForCheck();
      this.cdr2.detectChanges();

    }
    console.warn('UtilVoice loadVoicesB', this.voices);

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
