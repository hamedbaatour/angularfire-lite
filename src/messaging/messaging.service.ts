import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {AngularFireLiteApp} from '../core.service';
import {isPlatformBrowser} from '@angular/common';
import {from, Observable, Subject} from 'rxjs';
import {FirebaseMessaging} from '@firebase/messaging-types';
import 'firebase/messaging';

@Injectable()
export class AngularFireLiteMessaging {

  private readonly messaging: FirebaseMessaging;
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
      return from(this.messaging.getToken());
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
      return from(this.messaging.requestPermission());
    }
  }

  deleteToken(token: string): Observable<any> {
    if (this.browser) {
      return from((this.messaging.deleteToken(token)));
    }
  }


}
