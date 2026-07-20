import { Component, signal, HostListener } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Hello World from Angular MFE 2');
  protected readonly incomingMessage = signal('');

  @HostListener('window:mfe:message', ['$event'])
  onMessage(event: Event) {
    const customEvent = event as CustomEvent;
    this.incomingMessage.set(customEvent.detail);
  }

  sendMessage() {
    window.dispatchEvent(
      new CustomEvent('mfe:message', { detail: 'Hello from Angular MFE 2!' })
    );
  }
}
