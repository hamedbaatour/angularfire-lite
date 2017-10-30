import { FirebaseAppConfig } from '../core.module';
import * as Ifirebase from 'firebase';
import { Injectable } from '@angular/core';


const firebase = Ifirebase;

@Injectable()
export class AngularFireLiteFirestore {

  public fb;

  constructor(public config: FirebaseAppConfig) {
    this.fb = firebase.initializeApp(this.config);
  }

}
