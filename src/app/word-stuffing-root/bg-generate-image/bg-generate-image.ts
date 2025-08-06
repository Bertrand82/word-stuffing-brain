import { Component } from '@angular/core';
import { GeminiService,responseShemaCheckSentence } from './../../../app/services/gemini';
import { ServiceGenerateImage }                  from './../../../app/services/service-generate-image';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'bg-generate-image',
  imports: [CommonModule,FormsModule],
  templateUrl: './bg-generate-image.html',
  styleUrl: './bg-generate-image.css'
})
export class BgGenerateImage {

  constructor(private serviceGenerateImage:ServiceGenerateImage){

  }

   prompt = '';
  imageUrl: string | null = null;
  loading = false;



  generate() {
    if (!this.prompt) return;
    this.loading = true;
    this.imageUrl = null;
    const model ="x-ai/grok-4";
    this.serviceGenerateImage.generateImage(this.prompt,model).subscribe({
      next: (res) => {
        this.imageUrl = res.data[0]?.url || null;
        this.loading = false;
      },
      error: (err) => {
        console.error("generateImage1",err);
        console.error("generateImage2",err.error);
        if (err.error){
          console.error("generateImage3",err.error.error);
          if (err.error.error){
            const message = err.error.error.message;
            console.error("generateImage4",message);
          }
        }

        this.loading = false;
      },
    });
  }
}
