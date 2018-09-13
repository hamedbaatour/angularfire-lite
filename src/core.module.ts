import {APP_INITIALIZER, ModuleWithProviders, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {BrowserTransferStateModule} from '@angular/platform-browser';

import {AngularFireLiteApp} from './core.service';
import {AngularFireLiteAuth} from './auth/auth.service';
import {AngularFireLiteDatabase} from './database/database.service';
import {AngularFireLiteFirestore} from './firestore/firestore.service';
import {AngularFireLiteStorage} from './storage/storage.service';
import {AngularFireLiteMessaging} from './messaging/messaging.service';

export function AngularFireLiteAppFactory(config: FirebaseAppConfig) {
  return new AngularFireLiteApp(config);
}

export function fsInit(app: AngularFireLiteApp) {
  return function () {
    return new Promise(function (resolve) {
      app.instance().firestore().settings({timestampsInSnapshots: true});
      resolve();
    });
  };
}

export class FirebaseAppConfig {
  apiKey?: string;
  authDomain?: string;
  databaseURL?: string;
  projectId?: string;
  storageBucket?: string;
  messagingSenderId?: string;
}
// @dynamic
@NgModule({
  imports: [
    HttpClientModule,
    CommonModule,
    BrowserTransferStateModule
  ]
})
export class AngularFireLite {
  public static forRoot(fireConfig): ModuleWithProviders {
    return {
      ngModule: AngularFireLite,
      providers: [
        {provide: FirebaseAppConfig, useValue: fireConfig},
        {
          provide: AngularFireLiteApp,
          useFactory: AngularFireLiteAppFactory,
          deps: [FirebaseAppConfig]
        },
        {
          provide: APP_INITIALIZER,
          useFactory: fsInit,
          deps: [AngularFireLiteApp],
          multi: true
        },
        AngularFireLiteFirestore,
        AngularFireLiteDatabase,
        AngularFireLiteAuth,
        AngularFireLiteStorage,
        AngularFireLiteMessaging
      ]
    };
  }

}
