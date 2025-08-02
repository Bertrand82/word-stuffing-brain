import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export default class ServiceOpenRouterIdentification {

  code: string = 'no';
  codeVerifier: string='no';
  apiKey: string  = 'no';
  userId: string  = 'no';
  codeChallenge: string  = 'no';
  hashBuffer: ArrayBuffer | null = null;

  constructor() {
    console.log('ServiceOpenRouterIdentification initialized');
    this.apiKey = localStorage.getItem('apiKey') ?? 'no';
    this.userId = localStorage.getItem('userId') ?? 'no';
  }

  public async startAuth() {
    console.log('Starting authentication with OpenRouter');
    this.codeVerifier = generateCodeVerifier(64);
    this.codeChallenge = await generateCodeChallenge(this.codeVerifier);

    sessionStorage.setItem('pkce_code_verifier', this.codeVerifier);

    const authUrl = new URL('https://openrouter.ai/auth');
    const protocol = window.location.protocol; // ex: 'https:'
    const host = window.location.hostname;     // ex: 'example.com'
    const port = window.location.port;
    const url = window.location.href; // ex: 'https://example.com/path?query=string'
    const callBackUrl_old = `${protocol}//${host}${port ? ':' + port : ''}/callback`;
    const callBackUrl = `${window.location.href}callback`;
    const callBackUrl_ = `${window.location.href}#/callback`;

    console.log('Callback URL:', callBackUrl);
    authUrl.searchParams.set('callback_url', callBackUrl);
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('code_challenge', this.codeChallenge);
    authUrl.searchParams.set('code_challenge_method', 'S256');
    // … + client_id, scope, state, etc.

    window.location.href = authUrl.toString();
  }

}

/** Génère un `code_verifier` aléatoire (43‑128 chars selon RFC 7636) */
function generateCodeVerifier(length = 64): string {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array)
    .map((c) => chars[c % chars.length])
    .join('');
}

/** Calcule le hash SHA‑256 et encode en Base64‑URL sans padding */
async function generateCodeChallenge(codeVerifier: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = new Uint8Array(hashBuffer);
  let str = '';
  for (const byte of hashArray) {
    str += String.fromCharCode(byte);
  }
  const b64 = btoa(str);
  // conversion Base64 → Base64-URL sans padding
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export async function  handleCallback(): Promise<any> {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const codeVerifier = sessionStorage.getItem('pkce_code_verifier') || '';
    // supprimer stockage pour sécurité
    //sessionStorage.removeItem('pkce_code_verifier');

    if (code && codeVerifier) {
      const bodyString = JSON.stringify({
        code: code,
        code_verifier: codeVerifier,
        code_challenge_method: 'S256',
      });
      console.log('B Request body:', bodyString);
      const resp = await fetch('https://openrouter.ai/api/v1/auth/keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: bodyString,
      });

      console.log('B Response from OpenRouterA resp:', resp);
      const data = await resp.json();
      const apiKey = data.key; // clé API utilisateur
      localStorage.setItem('apiKey', data.key); // stocker la clé API
      localStorage.setItem('userId', data.user_id); // stocker l'ID

      return data; // clé API utilisateur

    }else {
      console.error('Code or verifier missing in callback');
      throw new Error('Code or verifier missing in callback');

    }

  }

