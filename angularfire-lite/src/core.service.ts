import { Injectable } from '@angular/core';

import * as Ifirebase from 'firebase';
import { FirebaseAppConfig } from './core.module';

const firebase = Ifirebase;


@Injectable()
export class AngularFireLiteApp {
  firebaseApp;

  constructor(public config: FirebaseAppConfig) {
    if (!firebase.apps.length) {
        this.firebaseApp = firebase.initializeApp(config);
    }
  }

  get instance() {
    if (!firebase.apps.length) {
      this.firebaseApp = firebase.initializeApp(this.config);
    }
    return this.firebaseApp;
  }

}
