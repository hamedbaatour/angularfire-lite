import { Inject, Injectable, NgZone, PLATFORM_ID } from '@angular/core';
import { isPlatformServer, isPlatformBrowser } from '@angular/common';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { AngularFireLiteApp } from '../core.service';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/first';

import * as Ifirebase from 'firebase';


const firebase = Ifirebase;

@Injectable()
export class AngularFireLiteDatabase {

  public fb;

  constructor(@Inject(PLATFORM_ID) private platformId: Object,
              public config: AngularFireLiteApp,
              public zone: NgZone) {
    if (firebase.apps.length) {
      this.fb = config.instance;
    }
  }

  // ------------- Read -----------------//

  read(ref: string): Subject<any> {
    if (isPlatformServer(this.platformId) && firebase.apps.length) {
      this.zone.runOutsideAngular(() => {
        const DATA = new Subject();
        this.fb.database().ref(ref).on('value', (snapshot) => {
          DATA.next(snapshot.val());
          DATA.first();
          DATA.unsubscribe();
        });
        return DATA.asObservable();
      });
    } else if (isPlatformBrowser(this.platformId)) {
      const DATA = new Subject();
      this.fb.database().ref(ref).on('value', (snapshot) => {
        DATA.next(snapshot.val());
      });
      return DATA;
    }
  }


  childAdded(ref: string): Subject<any> {
    const CHILD_ADDED = new Subject();
    this.fb.database().ref(ref).on('child_added', (snapshot) => {
      CHILD_ADDED.next(snapshot.val());
    });
    return CHILD_ADDED;
  }

  childChanged(ref: string): Subject<any> {
    const CHILD_CHANGED = new Subject();
    this.fb.database().ref(ref).on('child_changed', (snapshot) => {
      CHILD_CHANGED.next(snapshot.val());
    });
    return CHILD_CHANGED;
  }

  childRemoved(ref: string): Subject<any> {
    const CHILD_REMOVED = new Subject();
    this.fb.database().ref(ref).on('child_removed', (snapshot) => {
      CHILD_REMOVED.next(snapshot.val());
    });
    return CHILD_REMOVED;
  }


  // ------------- Write -----------------//

  write(ref: string, data: Object): Observable<any> {
    return Observable.fromPromise(this.fb.database().ref(ref).set(data));
  }

  push(ref: string, data: any): Observable<any> {
    return Observable.fromPromise(this.fb.database().ref(ref).push(data));
  }


  update(ref: string, data: any): Observable<any> {
    const update = {};
    update[ ref ] = data;
    return Observable.fromPromise(this.fb.database().ref().update(update));
  }

  // ------------- Delete -----------------//

  remove(ref: string) {
    return Observable.fromPromise(this.fb.database().ref(ref).remove());
  }

  // ------------- Query -----------------//

  // TODO: Query

}
