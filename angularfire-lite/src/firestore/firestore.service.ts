import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { AngularFireLiteApp } from '../core.service';
import * as Ifirebase from 'firebase';
const firebase = Ifirebase;

@Injectable()
export class AngularFireLiteFirestore {

  public fb;

  constructor(@Inject(PLATFORM_ID) private platformId: Object, public config: AngularFireLiteApp) {

    if (firebase.apps.length) {
      this.fb = config.instance;
    }

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
