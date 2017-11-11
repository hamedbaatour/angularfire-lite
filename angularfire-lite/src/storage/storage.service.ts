import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { AngularFireLiteApp } from '../core.service';
import 'rxjs/add/observable/fromPromise';
import * as Ifirebase from 'firebase';
const firebase = Ifirebase;

@Injectable()
export class AngularFireLiteStorage {

  public fb;

  constructor(@Inject(PLATFORM_ID) private platformId: Object, public config: AngularFireLiteApp) {

    if (firebase.apps.length) {
      this.fb = config.instance;
    }

  }


  // ------------- Upload -----------------//

  upload(ref: string, file: File | Blob | Uint8Array, metadata?: Object): Observable<any> {
    return Observable.fromPromise(this.fb.storage().ref().child(ref).put(file, metadata));
  }

  uploadString(ref: string, string: string): Observable<any> {
    return Observable.fromPromise(this.fb.storage().ref().child(ref).putString(string));
  }

  // ------------- Download -----------------//

  download(ref: string): Observable<any> {
    return Observable.fromPromise(this.fb.storage().ref().child(ref).getDownloadURL());
  }


  // ------------- Delete -----------------//

  remove(ref): Observable<any> {
    return Observable.fromPromise(this.fb.storage().ref().child(ref).delete());
  }

  // ------------- Metadata -----------------//

  getMetadata(ref: string): Subject<any> {
    const META = new Subject();
    this.fb.storage().ref().child(ref).getMetadata().then((meta) => {
      META.next(meta);
    });
    return META;
  }


  updateMetadata(ref: string, metadata: Object): Observable<any> {
    return Observable.fromPromise(this.fb.storage().ref().child(ref).updateMetadata(metadata));
  }

  deleteMetadata(ref: string): Observable<any> {
    return Observable.fromPromise(this.fb.storage().ref().child(ref).updateMetadata({
      customMetadata: null,
      cacheControl: null,
      contentEncoding: null,
      contentLanguage: null,
      contentType: null
    }));
  }

}
