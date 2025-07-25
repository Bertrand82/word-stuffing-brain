import { PreferencesService } from './../../services/preferences-service';
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

  preferencesService: PreferencesService;


  constructor(private cdr2: ChangeDetectorRef,preferencesService2 :PreferencesService) {
    this.preferencesService = preferencesService2
  }
  voices: SpeechSynthesisVoice[] = [];
  rate:number = 1;
  volume:number = 1;
  public selectedVoice!: SpeechSynthesisVoice ;
  @Output() voiceEnvoyee = new EventEmitter<SpeechSynthesisVoice>();
  @Output() rateEnvoyee = new EventEmitter<number>();
  @Output() volumeEnvoye = new EventEmitter<number>();
  selectedVoiceNameKey = 'selectedVoiceName';

  ngOnInit() {
    console.warn('UtilVoice ngOnInitA');
    this.voices = window.speechSynthesis.getVoices();

    window.speechSynthesis.onvoiceschanged = () => this.loadVoices();
  }
  onVolumeChange(newValue: number) {
    console.warn('UtilVoice onVolumeChange', newValue);
    this.volumeEnvoye.emit(newValue);
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
    this.saveConfig()
  }

  loadVoices() {
    console.warn('UtilVoice loadVoicesA');
    const v = this.preferencesService.langageToLearn ; // Default to 'en-US' if not set
    this.voices = window.speechSynthesis.getVoices().filter(voice =>
      voice.lang.startsWith(v)
    );

     if (this.voices.length > 0 && !this.selectedVoice) {

      this.getVoiceFromStorage();
      if (!this.selectedVoice){
        this.selectedVoice = this.voices[0];
      }
      this.voiceEnvoyee.emit(this.selectedVoice);
     // this.cdr.markForCheck();
      this.cdr2.detectChanges();

    }
    console.warn('UtilVoice loadVoicesB', this.voices);

  }



  toString2(){
    return "UtilVoice: selected :"+this.selectedVoice ;
  }

  saveConfig() {
    const voiceName = this.selectedVoice ? this.selectedVoice.name : undefined;
    if (voiceName) {
      localStorage.setItem(this.selectedVoiceNameKey, JSON.stringify(voiceName));
      console.warn('UtilVoice saveConfig1', voiceName);
    }
    console.warn('UtilVoice saveConfig2', voiceName);
  }

  getVoiceFromStorage() {
    const selectedVoiceNameJson = localStorage.getItem(this.selectedVoiceNameKey);
    const selectedVoiceName = selectedVoiceNameJson
      ? JSON.parse(selectedVoiceNameJson || '{}') : null;
      console.warn('UtilVoice ngOnInitD', selectedVoiceName);
    this.selectedVoice = this.voices.find(voice => voice.name === selectedVoiceName) || this.selectedVoice;
  }

  checkselectedVoiceIsInVoices() {
    if (this.selectedVoice && !this.voices.includes(this.selectedVoice)) {
      console.warn('UtilVoice checkselectedVoiceIsInVoices: selected voice is not in voices');
      this.selectedVoice = this.voices[0]; // Fallback to the first voice
    } else {
      console.warn('UtilVoice checkselectedVoiceIsInVoices: selected voice is in voices');
    }

  }
}
