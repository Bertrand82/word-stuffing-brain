import { Component,OnInit,Output, EventEmitter,ChangeDetectorRef, AfterViewInit   } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';  // ← Ajoutez cette ligne
@Component({
  selector: 'app-util-voice',
 // standalone: true,
  // Note: 'standalone: true' is used for Angular 14+ to indicate that this component is a standalone component.
  // If you are using an older version of Angular, you can remove this line and use
  imports: [FormsModule, CommonModule],

  templateUrl: './util-voice.html',
  styleUrl: './util-voice.css'
})
export class UtilVoice {


  constructor(private cdr2: ChangeDetectorRef) {}
  voices: SpeechSynthesisVoice[] = [];
  rate:number = 1;
  public selectedVoice!: SpeechSynthesisVoice;
  @Output() voiceEnvoyee = new EventEmitter<SpeechSynthesisVoice>();
  @Output() rateEnvoyee = new EventEmitter<number>();
  text: string = 'hi , it is an exercise .';

  ngOnInit() {
    console.warn('UtilVoice ngOnInitA');
    this.voices = window.speechSynthesis.getVoices();
    console.warn('UtilVoice ngOnInitB', this.voices);
    console.warn('UtilVoice ngOnInitC', this.voices);

    window.speechSynthesis.onvoiceschanged = () => this.loadVoices();



  }

  onRateChange(newValue: number) {
    console.warn('UtilVoice onRateChange', newValue);
    this.rateEnvoyee.emit(newValue);
  }
  onVoiceChange(newValue: SpeechSynthesisVoice) {
    //this.selectedVoiceName = newValue;
    console.warn('UtilVoice onVoiceChange', newValue);
    console.warn('UtilVoice onVoiceChange name', newValue.name);
    console.warn('UtilVoice onVoiceChange lang', newValue.lang);
    this.voiceEnvoyee.emit(this.selectedVoice);
  }

  loadVoices() {
    console.warn('UtilVoice loadVoicesA');
    this.voices = window.speechSynthesis.getVoices().filter(voice =>
      voice.lang.startsWith('en')
    );

     if (this.voices.length > 0 && !this.selectedVoice) {
      this.selectedVoice = this.voices[0];
      console.warn('UtilVoice loadVoicesAAAAAA', this.selectedVoice);
      this.voiceEnvoyee.emit(this.selectedVoice);
     // this.cdr.markForCheck();
      this.cdr2.detectChanges();

    }
    console.warn('UtilVoice loadVoicesB', this.voices);

  }

  speak() {
    const utterance = new SpeechSynthesisUtterance(this.text);
    console.warn('UtilVoice speak1', this.text, this.selectedVoice.lang);
    console.warn('UtilVoice speak2',  this.selectedVoice);
    console.warn('UtilVoice speak3 lang',  this.selectedVoice.lang);
    console.warn('UtilVoice speak4 name',  this.selectedVoice.name);
     // Vous pouvez changer la langue si nécessaire
    if (this.selectedVoice) {
      utterance.lang = this.selectedVoice.lang;
      utterance.voice = this.selectedVoice;
      utterance.rate = this.rate; // Vitesse de la parole (1 est la vitesse normale)
    }
    window.speechSynthesis.speak(utterance);
  }

  toString2(){
    return "UtilVoice: selected :"+this.selectedVoice ;
  }
}
