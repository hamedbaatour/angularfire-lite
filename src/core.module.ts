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
import {FirebaseAppConfig} from './core.config';

export function AngularFireLiteAppFactory(config: FirebaseAppConfig) {
  return new AngularFireLiteApp(config);
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
        AngularFireLiteFirestore,
        AngularFireLiteDatabase,
        AngularFireLiteAuth,
        AngularFireLiteStorage,
        AngularFireLiteMessaging
      ]
    };
  }

}
