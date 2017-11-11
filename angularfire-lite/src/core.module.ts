import { ModuleWithProviders, NgModule, NgZone } from '@angular/core';
import { AngularFireLiteAuth } from './auth/auth.service';
import { AngularFireLiteDatabase } from './database/database.service';
import { AngularFireLiteFirestore } from './firestore/firestore.service';
import { AngularFireLiteStorage } from './storage/storage.service';
import { AngularFireLiteMessaging } from './messaging/messaging.service';
import { AngularFireLiteApp } from './core.service';

export class FirebaseAppConfig {
  apiKey?: string;
  authDomain?: string;
  databaseURL?: string;
  storageBucket?: string;
  messagingSenderId?: string;
  projectId?: string;
}

export function AngularFireLiteAppFactory(config: FirebaseAppConfig, zone: NgZone) {
  return new AngularFireLiteApp(config, zone);
}

@NgModule({})
export class AngularFireLite {


  public static forRoot(config: FirebaseAppConfig): ModuleWithProviders {

    return {
      ngModule: AngularFireLite,
      providers: [
        {provide: FirebaseAppConfig, useValue: config},
        {
          provide: AngularFireLiteApp,
          useFactory: AngularFireLiteAppFactory,
          deps: [FirebaseAppConfig, NgZone],
        },
        AngularFireLiteAuth,
        AngularFireLiteDatabase,
        AngularFireLiteFirestore,
        AngularFireLiteStorage,
        AngularFireLiteMessaging
      ]
    };
  }

}
