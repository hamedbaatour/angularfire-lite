import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { AngularFireLiteApp } from '../core.service';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { isPlatformBrowser } from '@angular/common';

import { messaging } from 'firebase/app';


@Injectable()
export class AngularFireLiteMessaging {

  private readonly messaging: messaging.Messaging;

  constructor(private app: AngularFireLiteApp,
              @Inject(PLATFORM_ID) private platformId: Object) {
    this.messaging = app.instance().messaging();
  }


  // ------------- Getters -----------------//

  instance() {
    if (isPlatformBrowser(this.platformId)) {
      return this.messaging;
    }
  }

  token(): Observable<any> {
    if (isPlatformBrowser(this.platformId)) {
      return fromPromise(this.messaging.getToken());
    }
  }

  tokenRefresh(): Subject<any> {
    if (isPlatformBrowser(this.platformId)) {
      const REFRESH_TOKEN = new Subject();
      this.messaging.onMessage(() => {
        this.messaging.getToken().then((token) => {
          REFRESH_TOKEN.next(token);
        });
      });
      return REFRESH_TOKEN;
    }
  }


  // ------------- Actions -----------------//

  requestPermission(): Observable<any> {
    if (isPlatformBrowser(this.platformId)) {
      return fromPromise(this.messaging.requestPermission());
    }
  }

  deleteToken(token: string): Observable<any> {
    if (isPlatformBrowser(this.platformId)) {
      return fromPromise((this.messaging.deleteToken(token)));
    }
  }


}
