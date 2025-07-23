// src/app/services/gemini.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { environment_secret } from '../../environments/environment_secret';


@Injectable({ providedIn: 'root' })
export class GeminiService {
  private apiUrl = `${environment.geminiApiUrl}`;

  constructor(private http: HttpClient) {}

  generateContent(prompt: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-goog-api-key': environment_secret.gk_d+environment_secret.gk_f
    });

    const body = {
      contents: [
        { parts: [{ text: prompt }] }
      ],
      generationConfig: {
      "responseMimeType":"application/json",
      "responseSchema": {
        "type":"object",
        "properties":{
          "isOK":{"type":"boolean"},
          "isMakeSens":{"type":"boolean"},
          "isFamiliar":{"type":"boolean"},
          "numberOfFaults":{"type":"number"},
          "corrected":{"type":"string"},
          "otherCorrectProposition":{"type":"string"}
        },
        "required":["isOK","isMakeSens","isFamiliar","corrected","numberOfFaults"],
        "propertyOrdering":["isOK","isMakeSens","isFamiliar","corrected","otherCorrectProposition"]
      }
    }
    };

    return this.http.post<any>(this.apiUrl, body, { headers });
  }
}
