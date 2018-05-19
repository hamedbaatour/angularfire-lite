import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { BrowserTransferStateModule } from '@angular/platform-browser';

import { AngularFireLiteApp } from './core.service';
import { AngularFireLiteAuth } from './auth/auth.service';
import { AngularFireLiteDatabase } from './database/database.service';
import { AngularFireLiteFirestore } from './firestore/firestore.service';
import { AngularFireLiteStorage } from './storage/storage.service';
import { AngularFireLiteMessaging } from './messaging/messaging.service';


export function AngularFireLiteAppFactory(config: FirebaseAppConfig) {
  return new AngularFireLiteApp(config);
}

export class FirebaseAppConfig {
  apiKey?: string;
  authDomain?: string;
  databaseURL?: string;
  projectId?: string;
  storageBucket?: string;
  messagingSenderId?: string;
}

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
        AngularFireLiteDatabase,
        AngularFireLiteAuth,
        AngularFireLiteFirestore,
        AngularFireLiteStorage,
        AngularFireLiteMessaging
      ]
    };
  }

}
