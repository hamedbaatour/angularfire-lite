import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { AngularFireLiteApp } from '../core.service';
import { HttpClient } from '@angular/common/http';
import { FirebaseAppConfig } from '../core.module';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { Observable } from 'rxjs/Observable';
import { TransferState, makeStateKey } from '@angular/platform-browser';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';

import { firestore } from 'firebase/app';
import 'firebase/firestore';


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


  // ------------- Read -----------------//

  // TODO: Support Transactions and Batched Writes

  read(ref: string): Observable<any> | BehaviorSubject<any> {
    const dataStateKey = makeStateKey<Object>('firestore');
    if (isPlatformServer(this.platformId)) {
      const data = {};
      return this.http
        .get(`https://firestore.googleapis.com/v1beta1/projects/${this.config.projectId}/databases/(default)/documents/${ref}`)
        .map((res: any) => {
          Object.keys(res.fields)
            .forEach((key) => {
              // noinspection TsLint
              for (const keyValue in res.fields[ key ]) {
                data[ key ] = res.fields[ key ][ keyValue ];
              }
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


  write(ref: string, data: Object, merge?: boolean): Observable<any> {
    // if (isPlatformServer(this.platformId)) {
    //   const serverData = {};
    //   let valueType;
    //   // noinspection TsLint
    //   for (const key in data) {
    //     switch (typeof data[ key ]) {
    //       case 'string': {
    //         valueType = 'stringValue';
    //         break;
    //       }
    //       case 'number': {
    //         valueType = 'doubleValue';
    //         break;
    //       }
    //       case 'boolean': {
    //         valueType = 'booleanValue';
    //         break;
    //       }
    //       case 'undefined': {
    //         valueType = 'nullValue';
    //         break;
    //       }
    //       case 'object': {
    //         if (data[ key ]) {
    //           valueType = 'mapValue';
    //         } else {
    //           valueType = 'nullValue';
    //         }
    //         break;
    //       }
    //       case 'function': {
    //         valueType = 'nullValue';
    //         break;
    //       }
    //     }
    //     serverData[ key ] = {
    //       valueType: data[ key ]
    //     };
    //   }
    //   return this.http
    //     .post(`https://firestore.googleapis.com/v1beta1/projects/${this.config.projectId}/databases/(default)/documents/${ref}`,
    //       {
    //         'fields': serverData
    //       }
    //     );
    // }
    if (isPlatformBrowser(this.platformId)) {
      return fromPromise(this.firestore.doc(ref).set(data, {merge: merge}));
    }
  }


  push(ref: string, data: Object): Observable<any> {
    // if (isPlatformServer(this.platformId)) {
    //   const serverData = {};
    //   let valueType;
    //   // noinspection TsLint
    //   for (const key in data) {
    //     switch (typeof data[ key ]) {
    //       case 'string': {
    //         valueType = 'stringValue';
    //         break;
    //       }
    //       case 'number': {
    //         valueType = 'doubleValue';
    //         break;
    //       }
    //       case 'boolean': {
    //         valueType = 'booleanValue';
    //         break;
    //       }
    //       case 'undefined': {
    //         valueType = 'nullValue';
    //         break;
    //       }
    //       case 'object': {
    //         if (data[ key ]) {
    //           valueType = 'arrayValue';
    //         } else {
    //           valueType = 'nullValue';
    //         }
    //         break;
    //       }
    //       case 'function': {
    //         valueType = 'nullValue';
    //         break;
    //       }
    //     }
    //     serverData[ key ] = {
    //       valueType: data[ key ]
    //     };
    //   }
    //   return this.http
    //     .post(`https://firestore.googleapis.com/v1beta1/projects/${this.config.projectId}/databases/(default)/documents/${ref}`,
    //     {
    //       'fields': serverData
    //     }
    //   );
    // }
    if (isPlatformBrowser(this.platformId)) {
      return fromPromise(this.firestore.collection(ref).add(data));
    }
  }

  update(ref: string, data: Object): Observable<any> {
    // if (isPlatformServer(this.platformId)) {
    //   const serverData = {};
    //   let valueType;
    //   // noinspection TsLint
    //   for (const key in data) {
    //     switch (typeof data[ key ]) {
    //       case 'string': {
    //         valueType = 'stringValue';
    //         break;
    //       }
    //       case 'number': {
    //         valueType = 'doubleValue';
    //         break;
    //       }
    //       case 'boolean': {
    //         valueType = 'booleanValue';
    //         break;
    //       }
    //       case 'undefined': {
    //         valueType = 'nullValue';
    //         break;
    //       }
    //       case 'object': {
    //         if (data[ key ]) {
    //           valueType = 'arrayValue';
    //         } else {
    //           valueType = 'nullValue';
    //         }
    //         break;
    //       }
    //       case 'function': {
    //         valueType = 'nullValue';
    //         break;
    //       }
    //     }
    //     serverData[ key ] = {
    //       valueType: data[ key ]
    //     };
    //   }
    //   return this.http
    //     .patch(`https://firestore.googleapis.com/v1beta1/projects/${this.config.projectId}/databases/(default)/documents/${ref}`,
    //     {
    //       'fields': serverData
    //     }
    //   );
    // }
    if (isPlatformBrowser(this.platformId)) {
      return fromPromise(this.firestore.doc(ref).update(data));
    }
  }

  // ------------- Delete -----------------//

  remove(DocumentRef: string): Observable<any> {
    if (isPlatformServer(this.platformId)) {
      return this.http
        .delete(`https://firestore.googleapis.com/v1beta1/projects/${this.config.projectId}/databases/(default)/documents/${DocumentRef}`);
    }
    if (isPlatformBrowser(this.platformId)) {
      return fromPromise(this.firestore.doc(DocumentRef).delete());
    }
  }

  removeField(ref: string, fieldToDelete: string): Observable<any> {
    const update = {};
    update[ fieldToDelete ] = firestore.FieldValue.delete();
    if (isPlatformBrowser(this.platformId)) {
      return fromPromise(this.firestore.doc(ref).update(update));
    }

  }

  removeCollection(collectionRef: string): Observable<any> {
    if (isPlatformBrowser(this.platformId)) {
      return fromPromise(this.firestore.collection(collectionRef).get().then((snapshot) => {
        snapshot.docs.forEach((doc) => {
          this.firestore.batch().delete(doc.ref);
        });
      }));
    }
  }

  // ------------- Query -----------------//


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
  //       const dataStateKey = makeStateKey<Object>('firestore');
  //       const data = {};
  //       return this.http
  //         .get(`https://firestore.googleapis.com/v1beta1/projects/${this.config.projectId}/databases/(default)/documents/${ref}`)
  //         .map((res: any) => res.document)
  //         .map((res: any) => {
  //           Object.keys(res.fields)
  //             .forEach((key) => {
  //               // noinspection TsLint
  //               for (const keyValue in res.fields[ key ]) {
  //                 data[ key ] = res.fields[ key ][ keyValue ];
  //               }
  //             });
  //           return data;
  //         })
  //         .do((payload) => {
  //           this.state.set(dataStateKey, payload);
  //         });
  //     }
  //   };
  // };

}
