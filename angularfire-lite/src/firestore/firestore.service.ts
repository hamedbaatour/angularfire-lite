import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { AngularFireLiteApp } from '../core.service';
import { HttpClient } from '@angular/common/http';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { Observable } from 'rxjs/Observable';
import { FirebaseAppConfig } from '../../dist/core.module';
import { TransferState, makeStateKey } from '@angular/platform-browser';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';

import { firestore } from 'firebase/app';
import 'firebase/firestore';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';


@Injectable()
export class AngularFireLiteFirestore {

  private readonly firestore: firestore.Firestore;
  private readonly config: FirebaseAppConfig;

  constructor(private app: AngularFireLiteApp,
              private http: HttpClient,
              private state: TransferState,
              @Inject(PLATFORM_ID) private platformId: Object) {
    this.firestore = app.instance().firestore();
    this.config = app.config();
  }


  read(ref: string) {
    const dataStateKey = makeStateKey<Object>('firestore');
    if (isPlatformServer(this.platformId)) {
      const data = {};
      return this.http
        .get(`https://firestore.googleapis.com/v1beta1/projects/${this.config.projectId}/databases/(default)/documents/${ref}`)
        .map((res: any) => {
          Object.keys(res.fields)
            .forEach((key) => {
              // noinspection TsLint
              for (let keyValue in res.fields[ key ])
                data[ key ] = res.fields[ key ][ keyValue ];
            });
          return data;
        })
        .do((payload) => {
          this.state.set(dataStateKey, payload);
        });
    }
    if (isPlatformBrowser(this.platformId)) {
      const SSRedValue = this.state.get(dataStateKey, 'loading...');
      const DATA = new BehaviorSubject<any>(SSRedValue);
      this.firestore.doc(ref).onSnapshot((snapshot) => {
        DATA.next(snapshot.data());
      });
      return DATA;
    }
  }

  
  // ------------- Write -----------------//

  // write(ref: string, data: Object): Observable<any> {
  //   if (isPlatformServer(this.platformId)) {
  //     return this.http.post(`https://firestore.googleapis.com/v1beta1/projects/${this.config.projectId}/databases/(default)`,
  //       {
  //         'labels': data
  //       }
  //     );
  //   }
  //   if (isPlatformBrowser(this.platformId)) {
  //     return fromPromise(this.firestore.doc(ref).set(data));
  //   }
  // }
  //
  // push(ref: string, data: any): Observable<any> {
  //   if (isPlatformServer(this.platformId)) {
  //     return this.http.post(`https://${this.config.projectId}.firebaseio.com/${ref}.json?print=silent`, data);
  //   }
  //   if (isPlatformBrowser(this.platformId)) {
  //     return fromPromise(this.database.ref(ref).push(data));
  //   }
  // }
  //
  // update(ref: string, data: any): Observable<any> {
  //   if (isPlatformServer(this.platformId)) {
  //     return this.http.patch(`https://${this.config.projectId}.firebaseio.com/${ref}.json?print=silent`, data);
  //   }
  //   if (isPlatformBrowser(this.platformId)) {
  //     return fromPromise(this.database.ref(ref).update(data));
  //   }
  // }
  //
  // // ------------- Delete -----------------//
  //
  // remove(ref: string): Observable<any> {
  //   if (isPlatformServer(this.platformId)) {
  //     return this.http.delete(`https://${this.config.projectId}.firebaseio.com/${ref}.json`);
  //   }
  //   if (isPlatformBrowser(this.platformId)) {
  //     return fromPromise(this.database.ref(ref).remove());
  //   }
  // }


  //
  // query(ref: string): IQuery {
  //
  //   const HTTP = this.http;
  //   const CONFIG = this.config;
  //
  //   return {
  //     RESTQuery: '',
  //
  //     orderByChild(query: string): IQuery {
  //       this.RESTQuery += `&orderBy="${query}"`;
  //       return this;
  //     },
  //
  //     orderByKey(): IQuery {
  //       this.RESTQuery += `&orderBy="$key"`;
  //       return this;
  //     },
  //
  //
  //     orderByPriority(): IQuery {
  //       this.RESTQuery += `&orderBy="$priority"`;
  //       return this;
  //     },
  //
  //     orderByValue(): IQuery {
  //       this.RESTQuery += `&orderBy="$value"`;
  //       return this;
  //     },
  //
  //     startAt(query: number | string | boolean | null): IQuery {
  //       this.RESTQuery += `&startAt=${query}`;
  //       return this;
  //     },
  //
  //     endAt(query: number | string | boolean | null): IQuery {
  //       this.RESTQuery += `&endAt=${query}`;
  //       return this;
  //     },
  //
  //     equalTo(query: number | string | boolean | null): IQuery {
  //       this.RESTQuery += `&equalTo=${query}`;
  //       return this;
  //     },
  //
  //     limitToFirst(limit: number): IQuery {
  //       this.RESTQuery += `&limitToFirst=${limit}`;
  //       return this;
  //     },
  //
  //     limitToLast(limit: number): IQuery {
  //       this.RESTQuery += `&limitToLast=${limit}`;
  //       return this;
  //     },
  //
  //     run(): Observable<any> {
  //       return HTTP.get(`https://${CONFIG.projectId}.firebaseio.com/${ref}.json?${this.RESTQuery}`);
  //     }
  //   };
  // };

}



