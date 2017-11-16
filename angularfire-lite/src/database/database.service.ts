import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { AngularFireLiteApp } from '../core.service';
import { FirebaseAppConfig } from '../core.module';


@Injectable()
export class AngularFireLiteDatabase {

  public fb;

  constructor(@Inject(PLATFORM_ID) private platformId: Object,
              public app: AngularFireLiteApp,
              public config: FirebaseAppConfig,
              public http: HttpClient) {
    this.fb = app.instance;
  }

  // ------------- Read -----------------//

  read(ref: string, SSRQuery?: string): Subject<any> | Observable<any> {
    if (isPlatformServer(this.platformId)) {
      return this.http.get(`https://${this.config.projectId}.firebaseio.com/${ref}.json`);
    }
    if (isPlatformBrowser(this.platformId)) {
      const VALUE = new Subject();
      this.fb.database().ref(ref).on('value', (snapshot) => {
        VALUE.next(snapshot.val());
      });
      return VALUE;
    }
  }

  childAdded(ref: string, SSRQuery?: string): Subject<any> | Observable<any> {
    if (isPlatformServer(this.platformId)) {
      return this.http.get(`https://${this.config.projectId}.firebaseio.com/${ref}.json`);
    }
    if (isPlatformBrowser(this.platformId)) {
      const CHILD_ADDED = new Subject();
      this.fb.database().ref(ref).on('child_added', (snapshot) => {
        CHILD_ADDED.next(snapshot.val());
      });
      return CHILD_ADDED;
    }

  }

  childChanged(ref: string, SSRQuery?: string): Subject<any> | Observable<any> {
    if (isPlatformServer(this.platformId)) {
      return this.http.get(`https://${this.config.projectId}.firebaseio.com/${ref}.json`);
    }
    if (isPlatformBrowser(this.platformId)) {
      const CHILD_CHANGED = new Subject();
      this.fb.database().ref(ref).on('child_changed', (snapshot) => {
        CHILD_CHANGED.next(snapshot.val());
      });
      return CHILD_CHANGED;

    }
  }

  childRemoved(ref: string, SSRQuery?: string): Subject<any> | Observable<any> {
    if (isPlatformServer(this.platformId)) {
      return this.http.get(`https://${this.config.projectId}.firebaseio.com/${ref}.json`);
    }
    if (isPlatformBrowser(this.platformId)) {
      const CHILD_REMOVED = new Subject();
      this.fb.database().ref(ref).on('child_removed', (snapshot) => {
        CHILD_REMOVED.next(snapshot.val());
      });
      return CHILD_REMOVED;
    }

  }

  childMoved(ref: string, SSRQuery?: string): Subject<any> | Observable<any> {
    if (isPlatformServer(this.platformId)) {
      return this.http.get(`https://${this.config.projectId}.firebaseio.com/${ref}.json`);
    }
    if (isPlatformBrowser(this.platformId)) {
      const CHILD_MOVED = new Subject();
      this.fb.database().ref(ref).once('child_moved', (snapshot) => {
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
      return Observable.fromPromise(this.fb.database().ref(ref).set(data));
    }
  }

  push(ref: string, data: any): Observable<any> {
    if (isPlatformServer(this.platformId)) {
      return this.http.post(`https://${this.config.projectId}.firebaseio.com/${ref}.json?print=silent`, data);
    }
    if (isPlatformBrowser(this.platformId)) {
      return Observable.fromPromise(this.fb.database().ref(ref).push(data));
    }
  }

  update(ref: string, data: any): Observable<any> {
    if (isPlatformServer(this.platformId)) {
      return this.http.patch(`https://${this.config.projectId}.firebaseio.com/${ref}.json?print=silent`, data);
    }
    if (isPlatformBrowser(this.platformId)) {
      return Observable.fromPromise(this.fb.database().ref(ref).update(data));
    }
  }

  // ------------- Delete -----------------//

  remove(ref: string): Observable<any> {
    if (isPlatformServer(this.platformId)) {
      return this.http.delete(`https://${this.config.projectId}.firebaseio.com/${ref}.json`);
    }
    if (isPlatformBrowser(this.platformId)) {
      return Observable.fromPromise(this.fb.database().ref(ref).remove());
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
