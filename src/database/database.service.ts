import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { AngularFireLiteApp } from '../core.service';
import { HttpClient } from '@angular/common/http';
import { makeStateKey, TransferState } from '@angular/platform-browser';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FirebaseDatabase } from '@firebase/database-types';
import 'firebase/database';

@Injectable()
export class AngularFireLiteDatabase {

  private readonly database: FirebaseDatabase;
  private readonly config;
  private readonly server = isPlatformServer(this.platformId);
  private readonly browser = isPlatformBrowser(this.platformId);
  private readonly ref = (ref) => this.database.ref(ref);

  constructor(private app: AngularFireLiteApp,
              private http: HttpClient,
              private state: TransferState,
              @Inject(PLATFORM_ID) private platformId: Object) {
    this.database = app.instance().database();
    this.config = app.config();
  }

  // ------------- Read -----------------//

  read(ref: string): BehaviorSubject<any> | Observable<any> {
    const dataStateKey = makeStateKey<Object | Array<any>>(ref);
    if (this.server) {
      return this.SRH(ref, dataStateKey);
    }
    if (this.browser) {
      return this.BRH(ref, 'value', dataStateKey);
    }
  }

  childAdded(ref: string): BehaviorSubject<any> | Observable<any> {
    const dataStateKey = makeStateKey<Object>(ref);
    if (this.server) {
      return this.SRH(ref, dataStateKey);
    }
    if (this.browser) {
      return this.BRH(ref, 'child_added', dataStateKey);
    }
  }

  childChanged(ref: string): BehaviorSubject<any> | Observable<any> {
    const dataStateKey = makeStateKey<Object>(ref);
    if (this.server) {
      return this.SRH(ref, dataStateKey);
    }
    if (this.browser) {
      return this.BRH(ref, 'child_changed', dataStateKey);
    }
  }

  childRemoved(ref: string): BehaviorSubject<any> | Observable<any> {
    const dataStateKey = makeStateKey<Object>(ref);
    if (this.server) {
      return this.SRH(ref, dataStateKey);
    }
    if (this.browser) {
      return this.BRH(ref, 'child_removed', dataStateKey);
    }
  }

  childMoved(ref: string): BehaviorSubject<any> | Observable<any> {
    const dataStateKey = makeStateKey<Object>(ref);
    if (this.server) {
      return this.SRH(ref, dataStateKey);
    }
    if (this.browser) {
      return this.BRH(ref, 'child_moved', dataStateKey);
    }
  }

  write(ref: string, data: Object): Observable<any> {
    if (this.server) {
      return this.http.put(`https://${this.config.projectId}.firebaseio.com/${ref}.json?print=silent`, data);
    }
    if (this.browser) {
      return from(this.ref(ref).set(data));
    }
  }

  push(ref: string, data: any): Observable<any> {
    if (this.server) {
      return this.http.post(`https://${this.config.projectId}.firebaseio.com/${ref}.json?print=silent`, data);
    }
    if (this.browser) {
      return from(this.ref(ref).push(data));
    }
  }

  // ------------- Write -----------------//

  update(ref: string, data: any): Observable<any> {
    if (this.server) {
      return this.http.patch(`https://${this.config.projectId}.firebaseio.com/${ref}.json?print=silent`, data);
    }
    if (this.browser) {
      return from(this.ref(ref).update(data));
    }
  }

  remove(ref: string): Observable<any> {
    if (this.server) {
      return this.http.delete(`https://${this.config.projectId}.firebaseio.com/${ref}.json`);
    }
    if (this.browser) {
      return from(this.ref(ref).remove());
    }
  }

  query(ref: string) {
    const PID = this.platformId;
    const state = this.state;
    const db = this.database;
    const http = this.http;
    const config = this.config;

    const SQH = function (REF, FSQ, DSK) {
      return http.get(`https://${config.projectId}.firebaseio.com/${REF}.json?${FSQ}`)
        .pipe(map((payload) => {
          if (!!payload && typeof payload === 'object') {
            const result = Object.keys(payload).map((key) => {
              return [payload[key]];
            });
            state.set(DSK, result);
            return result;
          } else {
            state.set(DSK, payload);
            return payload;
          }
        }));
    };

    const BQH = function (BS) {
      return (snapshot) => {
        if (!!snapshot.val() && typeof snapshot.val() === 'object') {
          const result = Object.keys(snapshot.val()).map(function (key) {
            return [snapshot.val()[key]];
          });
          BS.next(result);
        } else {
          BS.next(snapshot.val());
        }
      };
    };

    let SQ = '';
    let BQ = this.ref(ref) as any;
    return {

      startAt(value: number | string | boolean | null): RDQuery {
        SQ += `&startAt=${value}`;
        BQ = BQ.startAt(value);
        return this;
      },

      endAt(value: number | string | boolean | null): RDQuery {
        SQ += `&endAt=${value}`;
        BQ = BQ.endAt(value);
        return this;
      },

      equalTo(value: number | string | boolean | null): RDQuery {
        SQ += `&equalTo=${value}`;
        BQ = BQ.equalTo(value);
        return this;
      },

      isEqual(query: null | any): boolean {
        if (isPlatformBrowser(PID)) {
          return db.ref(ref).isEqual(query);
        }
      },

      limitToFirst(limit: number): RDQuery {
        SQ += `&limitToFirst=${limit}`;
        BQ = BQ.limitToFirst(limit);
        return this;
      },

      limitToLast(limit: number): RDQuery {
        SQ += `&limitToLast=${limit}`;
        BQ = BQ.limitToLast(limit);
        return this;
      },

      orderByChild(path: string): RDQuery {
        SQ += `&orderBy="${path}"`;
        BQ = BQ.orderByChild(path);
        return this;
      },

      orderByKey(): RDQuery {
        SQ += `&orderBy="$key"`;
        BQ = BQ.orderByKey();
        return this;
      },

      orderByPriority(): RDQuery {
        SQ += `&orderBy="$priority"`;
        BQ = BQ.orderByPriority();
        return this;
      },

      orderByValue(): RDQuery {
        SQ += `&orderBy="$value"`;
        BQ = BQ.orderByValue();
        return this;
      },

      on(event: 'value' | 'child_added' | 'child_changed' | 'child_removed' | 'child_moved'): Observable<any> | BehaviorSubject<any> {
        const dataStateKey = makeStateKey<Object | Array<any>>(ref);
        if (isPlatformServer(PID)) {
          return SQH(ref, SQ, dataStateKey);
        }
        if (isPlatformBrowser(PID)) {
          const SSRedValue = state.get(dataStateKey, []);
          const VALUE = new BehaviorSubject<any>(SSRedValue);
          BQ.on(event, BQH(VALUE));
          return VALUE;
        }
      },

      once(event: 'value' | 'child_added' | 'child_changed' | 'child_removed' | 'child_moved'): Observable<any> | BehaviorSubject<any> {
        const dataStateKey = makeStateKey<Object | Array<any>>(ref);
        if (isPlatformServer(PID)) {
          return SQH(ref, SQ, dataStateKey);
        }
        if (isPlatformBrowser(PID)) {
          const SSRedValue = state.get(dataStateKey, []);
          const VALUE = new BehaviorSubject<any>(SSRedValue);
          BQ.once(event, BQH(VALUE));
          return VALUE;
        }
      }

    };
  }

  // ------------- Delete -----------------//

  private SRH(ref, DSK) {
    return this.http.get(`https://${this.config.projectId}.firebaseio.com/${ref}.json`)
      .pipe(map((payload) => {
        if (!!payload && typeof payload === 'object') {
          const result = Object.keys(payload).map((key) => {
            return [payload[key]];
          });
          this.state.set(DSK, result);
          return result;
        } else {
          this.state.set(DSK, payload);
          return payload;
        }
      }));
  }


  // ------------- Query -----------------//

  private BRH(ref, event, DSK) {
    if (this.browser) {
      const SSRedValue = this.state.get(DSK, []);
      const DATA = new BehaviorSubject<any>(SSRedValue);
      this.ref(ref).on(event, (snapshot) => {
        if (!!snapshot.val() && typeof snapshot.val() === 'object') {
          const result = Object.keys(snapshot.val()).map(function (key) {
            return [snapshot.val()[key]];
          });
          DATA.next(result);
        } else {
          DATA.next(snapshot.val());
        }
      });
      return DATA;
    }
  }
}

// ------ Def  -------

export interface RDQuery {
  startAt(value: number | string | boolean | null): RDQuery;

  endAt(value: number | string | boolean | null): RDQuery;

  equalTo(value: number | string | boolean | null): RDQuery;

  isEqual(other: RDQuery | null): boolean;

  limitToFirst(limit: number): RDQuery;

  limitToLast(limit: number): RDQuery;

  orderByChild(path: string): RDQuery;

  orderByKey(): RDQuery;

  orderByPriority(): RDQuery;

  orderByValue(): RDQuery;

  on(eventType: 'value' | 'child_added' | 'child_changed' | 'child_removed' | 'child_moved'): Observable<any> | any;

  once(eventType: 'value' | 'child_added' | 'child_changed' | 'child_removed' | 'child_moved'): Observable<any> | any;
}
