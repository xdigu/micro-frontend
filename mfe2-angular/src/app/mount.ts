import { platformBrowser } from '@angular/platform-browser';
import { AppModule } from './app-module';

let appRef: any = null;

export async function mount(el: HTMLElement) {
  const appRoot = document.createElement('app-root');
  el.appendChild(appRoot);
  const moduleRef = await platformBrowser().bootstrapModule(AppModule);
  appRef = moduleRef;
}

export async function unmount(el: HTMLElement) {
  if (appRef) {
    appRef.destroy();
    appRef = null;
  }
  el.innerHTML = '';
}
