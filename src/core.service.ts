import { Injectable } from '@angular/core';

import * as firebase from 'firebase';
import { FirebaseAppConfig } from './core.module';

@Injectable()
export class AngularFireLiteApp {
  constructor(private appConfig: FirebaseAppConfig) {
  }

  public instance(): firebase.app.App {
    let firebaseApp: firebase.app.App;
    if (!firebase.apps.length) {
      firebaseApp = firebase.initializeApp(this.appConfig) as firebase.app.App;
    } else {
      firebaseApp = firebase.app();
    }
    return firebaseApp;
  }

  public config() {
    return this.appConfig;
  }
}
