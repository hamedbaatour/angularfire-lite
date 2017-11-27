import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { AngularFireLiteApp } from '../core.service';
import { HttpClient } from '@angular/common/http';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { makeStateKey, TransferState } from '@angular/platform-browser';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';

import { database } from 'firebase/app';
import 'rxjs/add/operator/do';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';


@Injectable()
export class AngularFireLiteDatabase {

  private readonly database: database.Database;
  private readonly config;

  constructor(private app: AngularFireLiteApp,
              private http: HttpClient,
              private state: TransferState,
              @Inject(PLATFORM_ID) private platformId: Object) {
    this.database = app.instance().database();
    this.config = app.config();
  }

  // ------------- Read -----------------//

  read(ref: string): Subject<any> | Observable<any> {
    const dataStateKey = makeStateKey<Object>('rtd');
    if (isPlatformServer(this.platformId)) {
      return this.http.get(`https://${this.config.projectId}.firebaseio.com/${ref}.json`)
        .do((payload) => {
          this.state.set(dataStateKey, payload);
        });
    }
    if (isPlatformBrowser(this.platformId)) {
      const SSRedValue = this.state.get(dataStateKey, 'loading...');
      const VALUE = new BehaviorSubject<any>(SSRedValue);
      this.database.ref(ref).on('value', (snapshot) => {
        VALUE.next(snapshot.val());
      });
      return VALUE;
    }
  }

  childAdded(ref: string): Subject<any> | Observable<any> {
    const dataStateKey = makeStateKey<Object>('childAdded');
    if (isPlatformServer(this.platformId)) {
      return this.http.get(`https://${this.config.projectId}.firebaseio.com/${ref}.json`)
        .do((payload) => {
          this.state.set(dataStateKey, payload);
        });
    }
    if (isPlatformBrowser(this.platformId)) {
      const SSRedValue = this.state.get(dataStateKey, 'loading...');
      const CHILD_ADDED = new BehaviorSubject<any>(SSRedValue);
      this.database.ref(ref).on('child_added', (snapshot) => {
        CHILD_ADDED.next(snapshot.val());
      });
      return CHILD_ADDED;
    }

  }

  childChanged(ref: string): Subject<any> | Observable<any> {
    const dataStateKey = makeStateKey<Object>('childChanged');
    if (isPlatformServer(this.platformId)) {
      return this.http.get(`https://${this.config.projectId}.firebaseio.com/${ref}.json`)
        .do((payload) => {
          this.state.set(dataStateKey, payload);
        });
    }
    if (isPlatformBrowser(this.platformId)) {
      const SSRedValue = this.state.get(dataStateKey, 'loading...');
      const CHILD_CHANGED = new BehaviorSubject<any>(SSRedValue);
      this.database.ref(ref).on('child_changed', (snapshot) => {
        CHILD_CHANGED.next(snapshot.val());
      });
      return CHILD_CHANGED;

    }
  }

  childRemoved(ref: string): Subject<any> | Observable<any> {
    const dataStateKey = makeStateKey<Object>('childRemoved');
    if (isPlatformServer(this.platformId)) {
      return this.http.get(`https://${this.config.projectId}.firebaseio.com/${ref}.json`)
        .do((payload) => {
          this.state.set(dataStateKey, payload);
        });
    }
    if (isPlatformBrowser(this.platformId)) {
      const SSRedValue = this.state.get(dataStateKey, 'loading...');
      const CHILD_REMOVED = new BehaviorSubject<any>(SSRedValue);
      this.database.ref(ref).on('child_removed', (snapshot) => {
        CHILD_REMOVED.next(snapshot.val());
      });
      return CHILD_REMOVED;
    }

  }

  childMoved(ref: string): Subject<any> | Observable<any> {
    const dataStateKey = makeStateKey<Object>('childMoved');
    if (isPlatformServer(this.platformId)) {
      return this.http.get(`https://${this.config.projectId}.firebaseio.com/${ref}.json`)
        .do((payload) => {
          this.state.set(dataStateKey, payload);
        });
    }
    if (isPlatformBrowser(this.platformId)) {
      const SSRedValue = this.state.get(dataStateKey, 'loading...');
      const CHILD_MOVED = new BehaviorSubject<any>(SSRedValue);
      this.database.ref(ref).once('child_moved', (snapshot) => {
        CHILD_MOVED.next(snapshot.val());
      });
      return CHILD_MOVED;
    }
  }


  // ------------- Write -----------------//

  write(ref: string, data: Object): Observable<any> {
    if (isPlatformServer(this.platformId)) {
      return this.http.put(`https://${this.config.projectId}.firebaseio.com/${ref}.json?print=silent`, data);
    }
    if (isPlatformBrowser(this.platformId)) {
      return fromPromise(this.database.ref(ref).set(data));
    }
  }

  push(ref: string, data: any): Observable<any> {
    if (isPlatformServer(this.platformId)) {
      return this.http.post(`https://${this.config.projectId}.firebaseio.com/${ref}.json?print=silent`, data);
    }
    if (isPlatformBrowser(this.platformId)) {
      return fromPromise(this.database.ref(ref).push(data));
    }
  }

  update(ref: string, data: any): Observable<any> {
    if (isPlatformServer(this.platformId)) {
      return this.http.patch(`https://${this.config.projectId}.firebaseio.com/${ref}.json?print=silent`, data);
    }
    if (isPlatformBrowser(this.platformId)) {
      return fromPromise(this.database.ref(ref).update(data));
    }
  }

  // ------------- Delete -----------------//

  remove(ref: string): Observable<any> {
    if (isPlatformServer(this.platformId)) {
      return this.http.delete(`https://${this.config.projectId}.firebaseio.com/${ref}.json`);
    }
    if (isPlatformBrowser(this.platformId)) {
      return fromPromise(this.database.ref(ref).remove());
    }
  }


  // ------------- Query -----------------//


  query(ref: string): IQuery {

    const HTTP = this.http;
    const CONFIG = this.config;

    return {
      RESTQuery: '',

      orderByChild(query: string): IQuery {
        this.RESTQuery += `&orderBy="${query}"`;
        return this;
      },

      orderByKey(): IQuery {
        this.RESTQuery += `&orderBy="$key"`;
        return this;
      },


      orderByPriority(): IQuery {
        this.RESTQuery += `&orderBy="$priority"`;
        return this;
      },

      orderByValue(): IQuery {
        this.RESTQuery += `&orderBy="$value"`;
        return this;
      },

      startAt(query: number | string | boolean | null): IQuery {
        this.RESTQuery += `&startAt=${query}`;
        return this;
      },

      endAt(query: number | string | boolean | null): IQuery {
        this.RESTQuery += `&endAt=${query}`;
        return this;
      },

      equalTo(query: number | string | boolean | null): IQuery {
        this.RESTQuery += `&equalTo=${query}`;
        return this;
      },

      limitToFirst(limit: number): IQuery {
        this.RESTQuery += `&limitToFirst=${limit}`;
        return this;
      },

      limitToLast(limit: number): IQuery {
        this.RESTQuery += `&limitToLast=${limit}`;
        return this;
      },

      run(): Observable<any> {
        return HTTP.get(`https://${CONFIG.projectId}.firebaseio.com/${ref}.json?${this.RESTQuery}`);
      }
    };
  };

}

export interface IQuery {

  RESTQuery: string;

  run(): Observable<any>;

  orderByChild(query: string): IQuery;

  orderByKey(): IQuery;

  orderByPriority(): IQuery;

  orderByValue(): IQuery;

  startAt(query: number | string | boolean | null): IQuery;

  endAt(query: number | string | boolean | null): IQuery;

  equalTo(query: number | string | boolean | null): IQuery;

  limitToFirst(limit: number): IQuery;

  limitToLast(limit: number): IQuery;

}
