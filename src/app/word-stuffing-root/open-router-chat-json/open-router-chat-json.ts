import { ChangeDetectorRef, Component, model } from '@angular/core';
import {
  ServiceOpenRouterChatJson,
  ChatCompletionResponse,
} from '../../services/service-open-router-chat-json';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OpenRouterService } from '../../services/service-open-router';
import { PreferencesService } from '../../services/preferences-service';
import { NgxJsonViewerModule } from 'ngx-json-viewer';

@Component({
  selector: 'app-open-router-chat-json',
  imports: [CommonModule, FormsModule, NgxJsonViewerModule],
  templateUrl: './open-router-chat-json.html',
  styleUrl: './open-router-chat-json.css',
})
export class OpenRouterChatJson {
  userInput = '';
  systemContent = 'The system is a language model that checks the correctness of a sentence in the target language and provides corrections if necessary.';
  responseJson: any = {};
  processing: boolean = false;

  constructor(
    private openrouter: ServiceOpenRouterChatJson,
    protected orService: OpenRouterService,
    private cdr: ChangeDetectorRef,
    private preferencesService: PreferencesService

  ) {
    console.log(
      'OpenRouterChatJson component initialized with service:',
      openrouter
    );
  }

  ask() {
    console.log('User input:', this.userInput);
    if (!this.userInput.trim()) {
      console.error('User input is empty, nothing to send.');
      alert('Le prompt ne peut pas être vide.');
      return;
    }
    this.processing = true;
    const modelSelected: string = this.orService.selectedModel
      ? this.orService.selectedModel.id
      : 'openai/gpt-4o';

    this.openrouter
      .sendRequest({
        model: modelSelected,
        messages: [
          { role: 'user', content: this.userInput },
          { role: 'system', content: this.systemContent },
        ],
        response_format: {
          type: 'json_schema',
          json_schema: getSchemaResponse(this.preferencesService.langageToLearn, this.preferencesService.langageLearner),
        },
      })
      .subscribe({
        next: (res) => {
          console.log('response', res);
          this.processResponse(res);
        },
        error: (err) => {
          console.error(err);
          this.processing = false;
          alert("Erreur lors de l'envoi de la requête : " + err.message);
        },
      });
  }
  processResponse(res: ChatCompletionResponse) {
    console.log('Response received:', res);
    this.processing = false;
    for (const choice of res.choices) {
      console.log('Choice:', choice);
      if (choice.message && choice.message.content) {
        const responseJsonStr: string = choice.message.content;
        this.responseJson = JSON.parse(responseJsonStr);
        console.log('Parsed JSON:', this.responseJson);
      } else {
        console.warn('No content in message:', choice.message);
      }
    }

    this.cdr.detectChanges(); // Force la détection des changements pour mettre à jour l
    console.log('Response JSON:', res.choices[0].message.content);
  }
}
function getSchemaResponse(langageCible: string, langageRef: string): any {
  const schemaResponse = {
    name: 'responseComplexe',
    strict: true,
    schema: {
      type: 'object',
      properties: {
        isLanguageOK: {
          type: 'boolean',
          description: 'The prompt does not contain any mistakes in the '+langageCible+' language',
        },
        isMakeSens: { type: 'boolean', description: 'the prompt makes sense' },
        isFamiliar: {
          type: 'boolean',
          description: 'Prompt is in familiar language',
        },
        nbFaults: { type: 'number', description: 'number of faults' },
        corrected: {
          type: 'string',
          description: 'correct prompt in the '+langageCible+' language',
        },
        otherCorrectProposition: { type: 'Another more common proposal' },
        traduction: {
          type: 'string',
          description: 'translation into '+langageRef+' language',
        },
      },
      required: [
        'isLanguageOK',
        'isMakeSens',
        'isFamiliar',
        'corrected',
        'nbFaults',
        'otherCorrectProposition',
      ],
      additionalProperties: false,
    },
  };
  return schemaResponse;
}

const schemaResponse_old = {
  name: 'responseComplexe',
  strict: true,
  schema: {
    type: 'object',
    properties: {
      promptEquivalent: {
        type: 'string',
        description: 'Prompt équivalent mais mieux formulé dans la requête',
      },
      promptPossible: {
        type: 'string',
        description: 'Prompt possible ayant un sens voisin',
      },
      promptSuivant: { type: 'string', description: 'Prompt suivant' },
      reponse: { type: 'string', description: 'Réponse au prompt' },
    },
    required: [
      'promptEquivalent',
      'promptPossible',
      'promptSuivant',
      'reponse',
    ],
    additionalProperties: false,
  },
};

export const responseShemaCheckSentence_gemini = {
  type: 'object',
  properties: {
    isOK: { type: 'boolean' },
    isMakeSens: { type: 'boolean' },
    isFamiliar: { type: 'boolean' },
    numberOfFaults: { type: 'number' },
    corrected: { type: 'string' },
    otherCorrectProposition: { type: 'string' },
  },
  required: ['isOK', 'isMakeSens', 'isFamiliar', 'corrected', 'numberOfFaults'],
  propertyOrdering: [
    'isOK',
    'isMakeSens',
    'isFamiliar',
    'corrected',
    'otherCorrectProposition',
  ],
};
