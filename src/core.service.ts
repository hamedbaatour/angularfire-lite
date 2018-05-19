import { Injectable } from '@angular/core';
import { firebase } from '@firebase/app';
import { FirebaseAppConfig } from './core.module';
import 'firebase/app';

@Injectable()
export class AngularFireLiteApp {
  // fb: firebase;
  constructor(private appConfig: FirebaseAppConfig) {
    // this.fb = firebaseApp;
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
