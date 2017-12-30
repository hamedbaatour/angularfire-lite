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
  private readonly browser = isPlatformBrowser(this.platformId);

  constructor(private app: AngularFireLiteApp,
              @Inject(PLATFORM_ID) private platformId: Object) {
    this.messaging = app.instance().messaging();
  }


  // ------------- Getters -----------------//

  instance() {
    if (this.browser) {
      return this.messaging;
    }
  }

  token(): Observable<any> {
    if (this.browser) {
      return fromPromise(this.messaging.getToken());
    }
  }

  tokenRefresh(): Subject<any> {
    if (this.browser) {
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
    if (this.browser) {
      return fromPromise(this.messaging.requestPermission());
    }
  }

  deleteToken(token: string): Observable<any> {
    if (this.browser) {
      return fromPromise((this.messaging.deleteToken(token)));
    }
  }


}
