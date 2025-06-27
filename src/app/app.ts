import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WordStuffingRoot } from "./word-stuffing-root/word-stuffing-root";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, WordStuffingRoot],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'words-brain-stuffing';
}
