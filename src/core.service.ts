import { Injectable } from '@angular/core';
import { FirebaseAppConfig } from './core.module';
import { firebase } from '@firebase/app';
import 'firebase/app';

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
