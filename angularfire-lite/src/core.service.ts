import { Injectable, NgZone } from '@angular/core';

import * as Ifirebase from 'firebase';
import { FirebaseAppConfig } from './core.module';

const firebase = Ifirebase;


@Injectable()
export class AngularFireLiteApp {
  firebaseApp;

  constructor(public config: FirebaseAppConfig, public zone: NgZone) {
    if (!firebase.apps.length) {
      zone.runOutsideAngular( () => {
        this.firebaseApp = firebase.initializeApp(config);
      })
    }

  }

  get instance() {
    return this.zone.runOutsideAngular(() => {
      return this.firebaseApp;
    });

  }

}
