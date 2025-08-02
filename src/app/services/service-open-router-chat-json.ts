import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';





interface ChatCompletionRequest {
  model: string;
  messages: { role: string; content: string }[];
  response_format?: {
    type: 'json_schema';
    json_schema: {
      name: string;
      strict: boolean;
      schema: any;
    }
  };
  stream?: boolean;
}

export interface ChatCompletionChoice {
  index: number;
  message: { role: string; content: any };
  finish_reason: string;
}

export interface ChatCompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: ChatCompletionChoice[];
}


@Injectable({
  providedIn: 'root'
})
export class ServiceOpenRouterChatJson {

  private endpoint = 'https://openrouter.ai/api/v1/chat/completions';
  constructor(private http: HttpClient) {}

  sendRequest(request: ChatCompletionRequest): Observable<ChatCompletionResponse> {
    return this.http.post<ChatCompletionResponse>(this.endpoint, request, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('apiKey') || 'KeyNotFound'}`,
        'Content-Type': 'application/json'
      }
    });
  }
}

