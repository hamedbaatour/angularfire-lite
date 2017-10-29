import { ModuleWithProviders, NgModule } from '@angular/core';
import { AngularFireLiteAuth } from './auth/auth.service';

export class FirebaseAppConfig {
  apiKey?: string;
  authDomain?: string;
  databaseURL?: string;
  storageBucket?: string;
  messagingSenderId?: string;
  projectId?: string;
}


@NgModule({ })
export class AngularFireLite {

  public static forRoot(config: FirebaseAppConfig): ModuleWithProviders {

    return {
      ngModule: AngularFireLite,
      providers: [
        AngularFireLiteAuth,
        {provide: FirebaseAppConfig, useValue: config}
      ]
    };
  }
}
