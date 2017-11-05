import { Injectable } from '@angular/core';

import { FirebaseAppConfig } from '../core.module';
import * as Ifirebase from 'firebase';
const firebase = Ifirebase;

@Injectable()
export class AngularFireLiteFirestore {

  public fb;

  constructor(public config: FirebaseAppConfig) {
    this.fb = firebase.initializeApp(this.config);
  }

  //
  // doc = {
  //   set: (collection, document) => {
  //     this.fb.firestore()
  //   },
  //   add:,
  //   update:
  // };


}
