import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { AngularFireLiteApp } from '../core.service';
import { fromPromise } from 'rxjs/observable/fromPromise';

import { messaging } from 'firebase/app';


@Injectable()
export class AngularFireLiteMessaging {

  private readonly messaging: messaging.Messaging;

  constructor(private app: AngularFireLiteApp) {
    this.messaging = app.instance().messaging();
  }


  // ------------- Getters -----------------//

  get instance() {
    return this.messaging;
  }

  get token(): Observable<any> {
    return fromPromise(this.messaging.getToken());
  }

  get tokenRefresh(): Subject<any> {
    const REFRESH_TOKEN = new Subject();
    this.messaging.onMessage(() => {
      this.messaging.getToken().then((token) => {
        REFRESH_TOKEN.next(token);
      });
    });
    return REFRESH_TOKEN;
  }


  // ------------- Actions -----------------//

  requestPermission(): Observable<any> {
    return fromPromise(this.messaging.requestPermission());
  }

  deleteToken(token: string): Observable<any> {
    return fromPromise((this.messaging.deleteToken(token)));
  }


}
