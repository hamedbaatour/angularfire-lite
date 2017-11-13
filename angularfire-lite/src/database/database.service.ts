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

  read(ref: string): Subject<any> | Observable<any> {
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

  childAdded(ref: string): Subject<any> | Observable<any> {
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

  childChanged(ref: string): Subject<any> | Observable<any> {
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

  childRemoved(ref: string): Subject<any> | Observable<any> {
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

  // ------------- Write -----------------//

  write(ref: string, data: Object): Observable<any> {
    if (isPlatformServer(this.platformId)) {
      return this.http.put(`https://${this.config.projectId}.firebaseio.com/${ref}.json?print=`, data);
    }
    if (isPlatformBrowser(this.platformId)) {
      return Observable.fromPromise(this.fb.database().ref(ref).set(data));
    }
  }

  push(ref: string, data: any): Observable<any> {
    if (isPlatformServer(this.platformId)) {
      return this.http.post(`https://${this.config.projectId}.firebaseio.com/${ref}.json`, data);
    }
    if (isPlatformBrowser(this.platformId)) {
      return Observable.fromPromise(this.fb.database().ref(ref).push(data));
    }
  }

  update(ref: string, data: any): Observable<any> {
    if (isPlatformServer(this.platformId)) {
      return this.http.patch(`https://${this.config.projectId}.firebaseio.com/${ref}.json`, data);
    }
    if (isPlatformBrowser(this.platformId)) {
      return Observable.fromPromise(this.fb.database().ref(ref).update(data));
    }
  }

  // ------------- Delete -----------------//

  remove(ref: string) {
    if (isPlatformServer(this.platformId)) {
      return this.http.delete(`https://${this.config.projectId}.firebaseio.com/${ref}.json`);
    }
    if (isPlatformBrowser(this.platformId)) {
      return Observable.fromPromise(this.fb.database().ref(ref).remove());
    }
  }

  // ------------- Query -----------------//

  // TODO: Query

}
