import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { AngularFireLiteApp } from '../core.service';

import { firestore } from 'firebase/app';


@Injectable()
export class AngularFireLiteFirestore {

  private readonly firestore: firestore.Firestore;

  constructor(private app: AngularFireLiteApp) {
    this.firestore = app.instance().firestore();
  }


  read(path: string) {
    const DATA = new Subject();
    this.firestore.doc(path).onSnapshot((snapshot) => {
      DATA.next(snapshot.data());
    });
    return DATA;
  }


}


