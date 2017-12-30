import { Injectable } from '@angular/core';

import * as fire from 'firebase';
import { FirebaseAppConfig } from './core.module';
import { app } from 'firebase/app';

const firebase = fire;

@Injectable()
export class AngularFireLiteApp {
  constructor(private appConfig: FirebaseAppConfig) {
  }

  public instance(): app.App {
    let firebaseApp: app.App;
    if (!firebase.apps.length) {
      firebaseApp = firebase.initializeApp(this.appConfig) as app.App;
    } else {
      firebaseApp = firebase.app();
    }
    return firebaseApp;
  }

  public config() {
    return this.appConfig;
  }
}
