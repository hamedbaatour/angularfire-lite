import { FirebaseAppConfig } from '../core.module';
import * as Ifirebase from 'firebase';
import { Injectable } from '@angular/core';
import 'rxjs/add/observable/fromPromise';

const firebase = Ifirebase;

@Injectable()
export class AngularFireLiteDatabase {

  public fb;

  constructor(public config: FirebaseAppConfig) {
    this.fb = firebase.initializeApp(this.config);
  }

}
