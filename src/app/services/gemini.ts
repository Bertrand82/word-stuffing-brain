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
      'X-goog-api-key': environment_secret.geminiApiKey
    });

    const body = {
      contents: [
        { parts: [{ text: prompt }] }
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 512
      }
    };

    return this.http.post<any>(this.apiUrl, body, { headers });
  }
}
