import { platformBrowser } from '@angular/platform-browser';
import { AppModule } from './app/app-module';

if (document.querySelector('app-root')) {
  platformBrowser()
    .bootstrapModule(AppModule, {})
    .catch((err) => console.error(err));
}
