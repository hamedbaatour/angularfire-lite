import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { AngularFireLiteApp } from '../core.service';
import { fromPromise } from 'rxjs/observable/fromPromise';

import { storage } from 'firebase/app';
import 'firebase/storage';


@Injectable()
export class AngularFireLiteStorage {

  private readonly storage: storage.Storage;

  constructor(private app: AngularFireLiteApp) {
    this.storage = app.instance().storage();
  }

  // TODO: Add Server Side Rendering Support Using The GCS REST API

  // ------------- Upload -----------------//

  upload(ref: string, file: File | Blob | Uint8Array, metadata?: Object): Observable<any> {
    return fromPromise(this.storage.ref().child(ref).put(file, metadata));
  }

  uploadString(ref: string, string: string): Observable<any> {
    return fromPromise(this.storage.ref().child(ref).putString(string));
  }

  // ------------- Download -----------------//

  download(ref: string): Observable<any> {
    return fromPromise(this.storage.ref().child(ref).getDownloadURL());
  }


  // ------------- Delete -----------------//

  remove(ref): Observable<any> {
    return fromPromise(this.storage.ref().child(ref).delete());
  }

  // ------------- Metadata -----------------//

  getMetadata(ref: string): Subject<any> {
    const META = new Subject();
    this.storage.ref().child(ref).getMetadata().then((meta) => {
      META.next(meta);
    });
    return META;
  }


  updateMetadata(ref: string, metadata: Object): Observable<any> {
    return fromPromise(this.storage.ref().child(ref).updateMetadata(metadata));
  }

  deleteMetadata(ref: string): Observable<any> {
    return fromPromise(this.storage.ref().child(ref).updateMetadata({
      customMetadata: null,
      cacheControl: null,
      contentEncoding: null,
      contentLanguage: null,
      contentType: null
    }));
  }

}
