import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { AngularFireLiteApp } from '../core.service';
import { HttpClient } from '@angular/common/http';
import { FirebaseAppConfig } from '../core.module';
import { makeStateKey, TransferState } from '@angular/platform-browser';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { BehaviorSubject, from, Observable, of, Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { FirebaseFirestore } from '@firebase/firestore-types';
import 'firebase/firestore';

@Injectable()
export class AngularFireLiteFirestore {

  private readonly firestore: FirebaseFirestore;
  private readonly config: FirebaseAppConfig;
  private readonly browser = isPlatformBrowser(this.platformId);

  constructor(private app: AngularFireLiteApp,
              private http: HttpClient,
              private state: TransferState,
              @Inject(PLATFORM_ID) private platformId: Object) {
    this.firestore = app.instance().firestore();
    this.config = app.config();
  }

  // ------------- Read -----------------//


  read(ref: string): Observable<any> | BehaviorSubject<any> {
    const dataStateKey = makeStateKey<Object>(ref);

    const refArray = ref.split('/');
    if (refArray[0] === '/') {
      refArray.shift();
    }
    if (refArray[refArray.length - 1] === '/') {
      refArray.pop();
    }
    const slashes = refArray.length - 1;

    if (isPlatformServer(this.platformId)) {

      return this.http
        .get(`https://firestore.googleapis.com/v1beta1/projects/${this.config.projectId}/databases/(default)/documents/${ref}`)
        .pipe(map((res: any) => {
            const docData = {};
            if (slashes % 2 !== 0) {
              Object.keys(res.fields)
                .forEach((key) => {
                  for (const keyValue in res.fields[key]) {
                    if (keyValue) {
                      docData[key] = res.fields[key][keyValue];
                    }
                  }
                });
              return docData;
            } else {
              const colData = [];
              res.documents.forEach((doc) => {
                const singleDocData = {};
                Object.keys(doc.fields)
                  .forEach((key) => {
                    for (const keyValue in doc.fields[key]) {
                      if (keyValue) {
                        singleDocData[key] = doc.fields[key][keyValue];
                      }
                    }
                  });
                colData.push(singleDocData);
              });
              return colData;
            }
          })
          , tap((pl) => {
            this.state.set(dataStateKey, pl);
          }));
    }
    if (this.browser) {
      const data = [];
      const SSRedValue = this.state.get(dataStateKey, []);
      const DATA = new BehaviorSubject<any>(SSRedValue);

      if (slashes % 2 === 0) {
        this.firestore.collection(ref).onSnapshot((snapshot) => {
          snapshot.docs.forEach((doc) => {
            data.push(doc.data());
          });
          DATA.next(data);
        });
      } else {
        this.firestore.doc(ref).onSnapshot((snapshot) => {
          DATA.next(snapshot.data());
        });
      }
      return DATA;
    }
  }


  // ------------- Write -----------------//


  write(ref: string, data: Object, merge?: boolean): Observable<any> {
    if (this.browser) {
      return from(this.firestore.doc(ref).set(data, {merge: merge}));
    }
  }


  push(ref: string, data: Object): Observable<any> {
    if (this.browser) {
      return from(this.firestore.collection(ref).add(data));
    }
  }

  update(ref: string, data: Object): Observable<any> {
    if (this.browser) {
      return from(this.firestore.doc(ref).update(data));
    }
  }

  // ------------- Delete -----------------//

  remove(DocumentRef: string): Observable<any> {
    if (isPlatformServer(this.platformId)) {
      return this.http
        .delete(`https://firestore.googleapis.com/v1beta1/projects/${this.config.projectId}/databases/(default)/documents/${DocumentRef}`);
    }
    if (this.browser) {
      return from(this.firestore.doc(DocumentRef).delete());
    }
  }

  removeField(ref: string, ...fields): Observable<any> {
    if (this.browser) {
      return from(this.firestore.doc(ref).update(fields));
    }

  }

  removeCollection(collectionRef: string): Observable<any> {
    if (this.browser) {
      return from(this.firestore.collection(collectionRef).get().then((snapshot) => {
        snapshot.docs.forEach((doc) => {
          this.firestore.batch().delete(doc.ref);
        });
      }));
    }
  }

  // ------------- Query -----------------//

  query(ref: string) {
    const PID = this.platformId;
    const HTTP = this.http;
    const CONFIG = this.config;
    const state = this.state;
    const fs = this.firestore;
    const SSQ: any = {
      'from': [{'collectionId': `${ref}`}]
    };

    const SQHFS = function (DSK) {
      const data = [];
      return HTTP
        .post(`https://firestore.googleapis.com/v1beta1/projects/${CONFIG.projectId}/databases/(default)/documents:runQuery`, SQ)
        .pipe(map((res: any) => {
            for (const doc of res) {
              const documentData = {};
              Object.keys(doc.document.fields).forEach((fieldName) => {
                const fieldType = Object.keys(doc.document.fields[fieldName]);
                documentData[fieldName] = doc.document.fields[fieldName][fieldType[0]];
              });
              data.push(documentData);
            }
            return data;
          })
          , tap((pl) => {
            state.set(DSK, pl);
          }));
    };

    const SQ = {
      'structuredQuery': SSQ
    };
    const SQOB = [];
    let BQ = fs.collection(ref) as any;

    return {

      where(document: string, comparison: string, value: any): Query {
        let SOP = '';
        switch (comparison) {
          case '<':
            SOP = 'LESS_THAN';
            break;
          case '<=':
            SOP = 'LESS_THAN_OR_EQUAL';
            break;
          case '>':
            SOP = 'GREATER_THAN';
            break;
          case '>=':
            SOP = 'GREATER_THAN_OR_EQUAL';
            break;
          case '==':
            SOP = 'EQUAL';
            break;
        }
        SSQ['where'] = {};
        SSQ['where'].fieldFilter = {};
        SSQ['where'].fieldFilter.field = {};

        SSQ['where'].fieldFilter.field.fieldPath = ref;
        SSQ['where'].fieldFilter.op = SOP;
        SSQ['where'].fieldFilter.value = FormatServerData(value);
        BQ = BQ.where(document, comparison, value);
        return this;
      },

      startAt(...startValue): Query {
        const SV = [];
        startValue.forEach((value) => {
          SV.push(FormatServerData(value));
        });

        SSQ.startAt = {};

        SSQ.startAt.before = true;
        SSQ.startAt.values = SV;
        BQ = BQ.startAt(...startValue);
        return this;
      },

      startAfter(...startValue): Query {
        const SV = [];
        startValue.forEach((value) => {
          SV.push(FormatServerData(value));
        });

        SSQ.startAt = {};

        SSQ.startAt.before = false;
        SSQ.startAt.values = SV;
        BQ = BQ.startAfter(...startValue);
        return this;
      },

      endAt(...endValue): Query {
        const SV = [];
        endValue.forEach((value) => {
          SV.push(FormatServerData(value));
        });

        SSQ.endAt = {};

        SSQ.endAt.before = false;
        SSQ.endAt.values = SV;
        BQ = BQ.endAt(...endValue);
        return this;
      },

      endBefore(...endValue): Query {
        const SV = [];
        endValue.forEach((value) => {
          SV.push(FormatServerData(value));
        });

        SSQ.endAt = {};

        SSQ.endAt.before = true;
        SSQ.endAt.values = SV;
        BQ = BQ.endBefore(...endValue);
        return this;
      },

      limit(limit: number): Query {
        SSQ.limit = limit;
        BQ = BQ.limit(limit);
        return this;
      },

      orderBy(path: string, order?: 'asc' | 'desc'): Query {
        const orderBy = {
          field: {
            fieldPath: ''
          }
        };
        orderBy.field.fieldPath = path;
        switch (order) {
          case 'asc':
            orderBy['direction'] = 'ASCENDING';
            break;
          case 'desc':
            orderBy['direction'] = 'DESCENDING';
            break;
        }
        SQOB.push(orderBy);
        BQ = BQ.orderBy(path, order);
        SSQ.orderBy = SQOB as any;
        return this;
      },

      on(): BehaviorSubject<any> | Observable<any> {
        const ONDSK = makeStateKey<Object | Array<any>>(ref + ':query');
        if (isPlatformServer(PID)) {
          return SQHFS(ONDSK);
        }
        if (isPlatformBrowser(PID)) {
          const SSRedValue = state.get(ONDSK, []);
          const VALUE = new BehaviorSubject<any>(SSRedValue);
          BQ.onSnapshot((snapshot) => {
            const data = [];
            snapshot.forEach((doc) => {
              data.push(doc.data());
            });
            VALUE.next(data);
          });
          return VALUE;
        }
      },

      get(): BehaviorSubject<any> | Observable<any> {
        const GETDSK = makeStateKey<Object | Array<any>>(ref + ':query');
        if (isPlatformServer(PID)) {
          return SQHFS(GETDSK);
        }
        if (isPlatformBrowser(PID)) {
          const data = [];
          const SSRedValue = state.get(GETDSK, []);
          const VALUE = new BehaviorSubject<any>(SSRedValue);
          BQ.get().then((snapshot) => {
            snapshot.forEach((doc) => {
              data.push(doc);
            });
            VALUE.next(data);
          });
          return VALUE;
        }
      }

    };

  }


  // ------------- Transactions and Batched Writes -----------------//

  // TODO: Add Transactions SSR support

  transaction(): Transaction {
    if (this.browser) {
      const fs = this.firestore;
      let transactionToRun: Promise<any>;
      let readCount = 0;
      const transactions = {
        get(ref) {
          return fs.doc(ref).get();
        },
        set(ref, data) {
          return fs.doc(ref).set(data);
        }
      };
      return {
        set(ref: string, data: Object): Transaction {
          transactionToRun = transactionToRun.then(() => {
            transactions.set(ref, data);
          });
          return this;
        },
        get(ref: string): Subject<any> {
          const getSubject = new Subject();
          if (readCount > 0) {
            transactionToRun = transactionToRun.then(() => {
              transactions.get(ref).then((value) => {
                getSubject.next({data: value.data(), next: this});
              });
            });
          } else if (readCount === 0) {
            transactionToRun = transactions.get(ref).then((value) => {
              getSubject.next({data: value.data(), next: this});
            });
          }
          readCount++;
          return getSubject;
        },
        run(): Observable<any> {
          return from(fs.runTransaction(() => {
            return transactionToRun;
          }));
        }
      };
    } else {
      return {
        set(ref: string, data: Object): Transaction {
          return this;
        },

        get(ref: string): Subject<any> {
          return new Subject();
        },
        run(): Observable<any> {
          return of();
        }
      };
    }
  }

  // TODO: Add batched writes SSR support

  batch(): Batch {
    if (this.browser) {
      const fs = this.firestore;
      const b = this.firestore.batch();
      return {
        set(ref: string, data: Object): Batch {
          b.set(fs.doc(ref), data);
          return this;
        },
        update(ref: string, data: Object): Batch {
          b.update(fs.doc(ref), data);
          return this;
        },
        delete(ref: string): Batch {
          b.delete(fs.doc(ref));
          return this;
        },
        commit(): Observable<any> {
          return from(b.commit());
        }
      };
    } else {
      return {
        set(ref: string, data: Object) {
          return this;
        },
        update(ref: string, data: Object): Batch {
          return this;
        },
        delete(ref: string): Batch {
          return this;
        },
        commit(): Observable<any> {
          return of();
        }
      };
    }
  }


}

export function FormatServerData(value) {
  switch (value) {
    case (typeof value === 'boolean'):
      return {'booleanValue': value};
    case (typeof value === 'string'):
      return {'stringValue': value};
    case (typeof value === 'number'):
      return {'doubleValue': value};
    case (typeof value === 'object') && (value):
      return {'arrayValue': value};
  }
}

export interface Batch {
  set(ref: string, data: Object): Batch;

  update(ref: string, data: Object): Batch;

  delete(ref: string): Batch;

  commit(): Observable<any>
}

export interface Transaction {
  set(ref: string, data: Object): Transaction;

  get(ref: string): Subject<any>;

  run(): Observable<any>
}

export interface Query {
  where(document: string, comparison: string, value: any): Query;

  startAt(...startValue: Array<string>): Query;

  endAt(...endValue: Array<string>): Query;

  startAfter(...startValue: Array<string>): Query;

  endBefore(...endValue: Array<string>): Query;

  limit(limit: number): Query;

  orderBy(path: string, order?: 'asc' | 'desc'): Query;

  on(): BehaviorSubject<any> | Observable<any>;

  get(): BehaviorSubject<any> | Observable<any>;
}
