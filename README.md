 ## Url github
 
 https:github.com/Bertrand82/word-stuffing-brain
 
 ## Home
  [home](https://bertrand82.github.io/word-stuffing-brain/home.html) 
 https://bertrand82.github.io/word-stuffing-brain/home.html
 
 ## Build the project:
 
 ng build

## console google
 https://console.cloud.google.com/auth/scopes?inv=1&invt=Ab2kBw&project=wordtrainingbg
 
 ## Déployer sur github

-  >ng build --output-path docs --base-href /word-stuffing-brain/
-  copier à la main le repertoire browser de docs à la racine de doc
-  pusher
-  remarque : si l'on copie les fichiers depuis le repertoire build, ca ne marche , les liens de index.html ont la mauvaise reference.

 ## Déployer sur firebase

 >firebase init hosting
 Attention! cela re-ecrit le fichier index.htm du repertoire 'public'

 >firebase deploy
 
 # WordsEnglishBrainStuffing

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.0.3.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```
This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Console google drive api

https://console.cloud.google.com/apis/api/drive.googleapis.com/metrics?inv=1&invt=Ab2d7w&project=wordtrainingbg


## install

-  >npm install @googleworkspace/drive-picker-element
-  >ng add @angular/material


## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
