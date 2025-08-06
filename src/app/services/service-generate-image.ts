import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { environment_secret } from './../../environments/environment_secret';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ServiceGenerateImage {
  private apiUrl = environment.openRouterApiUrl;
  private apiKey = localStorage.getItem('apiKey');

  constructor(private http: HttpClient) { }

    generateImage(prompt: string, model:string): Observable<any> {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`,
      //'HTTP-Referer': this.apiUrl, // optionnel mais recommandé :contentReference[oaicite:1]{index=1}
      //'X-Title': 'BgGenerator'           // cf. docs :contentReference[oaicite:2]{index=2}
    });
    console.log("generateImage  apikey",this.apiKey)
    console.log("generateImage headers",headers)

    const body = {
      'model': model,
      'messages': [
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            // image_url content n’est pas nécessaire pour génération
          ]
        }
      ],
      response_format: { type: 'json_object' },
      // Vous pouvez ajouter 'stream': true si nécessaire
    };

    return this.http.post(this.apiUrl, body, { headers });
  }

}
