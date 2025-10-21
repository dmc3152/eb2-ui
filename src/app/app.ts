import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PwaHandler } from '@core/pwaHandler';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private pwaHandler = inject(PwaHandler);
  protected readonly title = signal('app');

  ngOnInit() {
    this.pwaHandler.subscribeToUpdates();
  }
}
