import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WordStuffingRoot } from "./word-stuffing-root/word-stuffing-root";
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, WordStuffingRoot],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'words-brain-stuffing';
}



