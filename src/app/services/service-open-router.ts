import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


export interface OpenRouterModel {
  id: string;
  name: string;
  canonical_slug: string;
  description: string;
  context_length: number;
  supported_parameters: string[];
  created: string;
  pricing: {
    prompt: number;
    completion: number;
    requests: number;
  }
  // autres champs selon votre besoin
}

interface ModelsResponse {
  data: OpenRouterModel[];
}

@Injectable({
  providedIn: 'root',
})

@Injectable({
  providedIn: 'root'
})
export class OpenRouterService {
  private baseUrlOpenRouter = 'https://openrouter.ai/api/v1';

  constructor(private http: HttpClient) {}

  listModels(apiKey: string): Observable<OpenRouterModel[]> {
     const headers = new HttpHeaders({
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    });
    return this.http.get<ModelsResponse>(`${this.baseUrlOpenRouter}/models`, { headers })
      .pipe(
        // map si nécessaire, par exemple map(res => res.data)
        map(res => res.data)
      );

  }

  selectedModel: OpenRouterModel | null = null;
}
