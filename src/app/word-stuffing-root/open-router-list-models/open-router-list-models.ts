import { Component, model, OnInit, ChangeDetectorRef } from '@angular/core';
import {
  OpenRouterService,
  OpenRouterModel,
} from './../../services/service-open-router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-open-router-list-models',
  imports: [CommonModule, FormsModule],
  templateUrl: './open-router-list-models.html',
  styleUrl: './open-router-list-models.css',
})
export class OpenRouterListModels implements OnInit {
  models: OpenRouterModel[] = [];
  filteredModels: OpenRouterModel[] = [];
  providers = [
    'google',
    'openai',
    'grok',
    'mistralai',
    'deepseek',
    'qwen',
    'microsoft',
    'shisa',
    'meta',
    'cohere',
    'all',
  ];
  selectedProvider: string = localStorage.getItem('selectedProvider') || 'google';

  constructor(
    private orService: OpenRouterService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const apiKey = localStorage.getItem('apiKey') || 'no API Key';
    this.orService.listModels(apiKey).subscribe({
      next: (data) => {
        this.models = data;
        this.applyFilter(); // Initialiser les modèles filtrés avec tous les modèles
        console.log('Modèles récupérés', this.models);
        this.getModelSelectedFromLocalStore()

        this.cdr.detectChanges(); // Force la détection des changements
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des modèles', err);
        this.cdr.detectChanges();
      },
    });
  }
  getModelSelectedFromLocalStore() {
        const selectedModelId =    localStorage.getItem('selectedModelId');
        if (selectedModelId) {
          const selectedModel = this.models.find(
            (m) => m.id === selectedModelId
          );
          console.log('Selected model from local storage:', selectedModel);


          if (selectedModel) {
            this.selectModel(selectedModel);
            console.log('Modèle sélectionné:', selectedModel);
          } else {
            console.warn('Modèle sélectionné non trouvé dans la liste');
          }
        } else {
          console.warn('Aucun modèle sélectionné trouvé dans le stockage local');
        }
  }

  applyFilter(): void {
    console.log('Filtrage appliqué avec le provider:', this.selectedProvider);
    if (!this.selectedProvider || this.selectedProvider === 'all') {
      this.filteredModels = this.models;
    } else {
      this.filteredModels = this.models.filter(
        (m) =>
          m.id.toLowerCase().indexOf(this.selectedProvider.toLowerCase()) > -1
      );
    }
  }

  showDetail(modelId: OpenRouterModel) {
    console.log('Détail du modèle:', modelId);
    alert(
      `Détail du modèle: ${modelId.name}\nID: ${modelId.id}\nDescription: ${
        modelId.description
      }\nContext Length: ${
        modelId.context_length
      }\nSupported Parameters: ${modelId.supported_parameters.join(
        ', '
      )}\n created :${modelId.created}`
    );
  }


  selectModel(m: OpenRouterModel) {
    console.log('Model selected:', m);
    this.orService.selectedModel = m;
    localStorage.setItem('selectedProvider', this.selectedProvider);
    localStorage.setItem('selectedModelId', m.id);
  }
}
