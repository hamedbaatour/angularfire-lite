import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { AngularFireLiteApp } from '../core.service';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { isPlatformBrowser } from '@angular/common';

import { storage } from 'firebase/app';
import 'firebase/storage';


@Injectable()
export class AngularFireLiteStorage {

  private readonly storage: storage.Storage;
  private readonly browser = isPlatformBrowser(this.platformId);

  constructor(private app: AngularFireLiteApp,
              @Inject(PLATFORM_ID) private platformId: Object) {
    this.storage = app.instance().storage();
  }

  // TODO: Add Server Side Rendering Support Using The GCS REST API

  // ------------- Upload -----------------//

  upload(ref: string, file: File | Blob | Uint8Array, metadata?: Object): Observable<any> {
    if (this.browser) {
      return fromPromise(this.child(ref).put(file, metadata));
    }
  }

  uploadString(ref: string, string: string): Observable<any> {
    if (this.browser) {
      return fromPromise(this.child(ref).putString(string));
    }
  }

  // ------------- Download -----------------//

  download(ref: string): Observable<any> {
    if (this.browser) {
      return fromPromise(this.child(ref).getDownloadURL());
    }
  }


  // ------------- Delete -----------------//

  remove(ref): Observable<any> {
    if (this.browser) {
      return fromPromise(this.child(ref).delete());
    }
  }

  // ------------- Metadata -----------------//

  getMetadata(ref: string): Subject<any> {
    if (this.browser) {
      const META = new Subject();
      this.child(ref).getMetadata().then((meta) => {
        META.next(meta);
      });
      return META;
    }
  }


  updateMetadata(ref: string, metadata: Object): Observable<any> {
    if (this.browser) {
      return fromPromise(this.child(ref).updateMetadata(metadata));
    }
  }

  deleteMetadata(ref: string): Observable<any> {
    if (this.browser) {
      return fromPromise(this.child(ref).updateMetadata({
        customMetadata: null,
        cacheControl: null,
        contentEncoding: null,
        contentLanguage: null,
        contentType: null
      }));
    }
  }

  private child(ref) {
    return this.storage.ref().child(ref);
  }

}

