import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { Observable } from 'rxjs/Observable';
import { AngularFireLiteApp } from '../core.service';
import * as Ifirebase from 'firebase';
const firebase = Ifirebase;

@Injectable()
export class AngularFireLiteMessaging {

  public fb;

  constructor(@Inject(PLATFORM_ID) private platformId: Object, public config: AngularFireLiteApp) {

    if (firebase.apps.length) {
      this.fb = config.instance;
    }

  }


  // ------------- Getters -----------------//

  get instance() {
    return this.fb.messaging();
  }

  get token(): Observable<any> {
    return Observable.fromPromise(this.fb.messaging().getToken());
  }

  get tokenRefresh(): Observable<any> {
    return this.fb.messaging().onMessage(() => {
      return Observable.fromPromise(this.fb.messaging().getToken());
    });
  }


  // ------------- Actions -----------------//

  requestPermission(): Observable<any> {
    return Observable.fromPromise(this.fb.messaging().requestPermission());
  }

  deleteToken(token: string): Observable<any> {
    return Observable.fromPromise((this.fb.messaging().deleteToken(token)));
  }


}
