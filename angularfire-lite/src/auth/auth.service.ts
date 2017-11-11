import { Inject, Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { AngularFireLiteApp } from '../core.service';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';

import 'rxjs/add/observable/fromPromise';

import * as Ifirebase from 'firebase';
const firebase = Ifirebase;


@Injectable()
export class AngularFireLiteAuth {
  public fb;

  constructor(@Inject(PLATFORM_ID) private platformId: Object, public config: AngularFireLiteApp) {
    if (firebase.apps.length) {
      this.fb = config.instance;
    }

  }


  // ------------- Getters -----------------//

  get uid(): Subject<any> {
    const UID = new Subject();
    this.authenticated.subscribe((isAuth) => {
      if (isAuth) {
        UID.next(this.fb.auth().currentUser.uid);
      }
    });
    return UID;
  }

  get authenticated(): Subject<any> {
    const isAuth = new Subject();
    this.fb.auth().onAuthStateChanged((user) => {
      isAuth.next(!!user);
    });
    return isAuth;
  }

  get Anonymous(): Subject<any> {
    const isAnonymous = new Subject();
    this.fb.auth().onAuthStateChanged((user) => {
      isAnonymous.next(user.isAnonymous);
    });
    return isAnonymous;
  }


  get user(): Subject<any> {
    const USER = new Subject();
    this.authenticated.subscribe((user) => {
      if (user) {
        USER.next(this.fb.auth().currentUser);
      }
    });
    return USER;
  }

  get UserData(): any {
    const userData = new Subject();
    this.fb.auth().onAuthStateChanged((user) => {
      if (user) {
        userData.next({
          displayName: user.displayName,
          email: user.email,
          emailVerified: user.emailVerified,
          photoURL: user.photoURL,
          isAnonymous: user.isAnonymous,
          uid: user.uid,
          providerData: user.providerData,
          providerId: user.providerId,
          phoneNumber: user.phoneNumber
        });
      }
    });
    return userData;
  }


  // ------------- Setters -----------------//

  set UserData(data: any) {
    Observable.fromPromise(this.fb.auth().currentUser.updateProfile(data));
  }


  set updateEmail(newEmail) {
    Observable.fromPromise(this.fb.auth().currentUser.updateEmail(newEmail));
  }

  set updatePassword(newPassword) {
    Observable.fromPromise(this.fb.auth().currentUser.updatePassword(newPassword));
  }


  // ------------- Actions -----------------//

  login(email: string, password: string): Observable<any> {
    return Observable.fromPromise(this.fb.auth().signInWithEmailAndPassword(email, password));
  }

  loginAnonymously(): Observable<any> {
    return Observable.fromPromise(this.fb.auth().signInAnonymously());
  }

  signup(email: string, password: string): Observable<any> {
    return Observable.fromPromise(this.fb.auth().createUserWithEmailAndPassword(email, password));
  }

  logout(): Observable<any> {
    return Observable.fromPromise(this.fb.auth().signOut());
  }

  verify(): Observable<any> {
    return Observable.fromPromise(this.fb.auth().currentUser.sendEmailVerification());
  }


  reset(email: string): Observable<any> {
    return Observable.fromPromise(this.fb.auth().sendPasswordResetEmail(email));
  }

  relogin(credentials): Observable<any> {
    return Observable.fromPromise(this.fb.auth().currentUser.reauthenticateWithCredential(credentials));
  }

  deletePermanently(credentials): Observable<any> {
    return Observable.fromPromise(this.fb.auth().currentUser.delete());
  }


}
