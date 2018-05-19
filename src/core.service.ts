import { Injectable } from '@angular/core';

import * as firebase from 'firebase/app';
import { FirebaseAppConfig } from './core.module';


@Injectable()
export class AngularFireLiteApp {
  constructor(private appConfig: FirebaseAppConfig) {
  }

  public instance() {
    let fbApp;
    if (!firebase.apps.length) {
      fbApp = firebase.initializeApp(this.appConfig);
    } else {
      fbApp = firebase.app();
    }
    return fbApp;
  }

  public config() {
    return this.appConfig;
  }
}
