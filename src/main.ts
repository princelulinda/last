import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment.bbs';
import { enableProdMode } from '@angular/core';



if (environment.production) {
    enableProdMode();

    // disable some console on production
    console.log = () => {
        // void
    };
    console.info = () => {
        //void
    };
}

bootstrapApplication(AppComponent, appConfig).catch(err => console.error(err));
