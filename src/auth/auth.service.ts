import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { AngularFireLiteApp } from '../core.service';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';

import { auth } from 'firebase/app';

@Injectable()
export class AngularFireLiteAuth {
  private readonly auth: auth.Auth;
  private readonly config;
  private readonly browser = isPlatformBrowser(this.platformId);
  private readonly server = isPlatformServer(this.platformId);

  constructor(private app: AngularFireLiteApp,
              private http: HttpClient,
              @Inject(PLATFORM_ID) private platformId: Object) {

    this.auth = app.instance().auth();
    this.config = app.config();
  }


  // ------------- Authentication Information Getters -----------------//

  uid(): Subject<any> {
    const UID = new Subject();
    this.isAuthenticated().subscribe((isAuth) => {
      if (isAuth) {
        this.auth.onAuthStateChanged((user) => {
          UID.next(user.uid);
        });
      } else {
        UID.next(null);
      }
    });
    return UID;
  }

  isAuthenticated(): Subject<any> {
    const IS_AUTHENTICATED = new Subject();
    this.auth.onAuthStateChanged((user) => {
      IS_AUTHENTICATED.next(!!user);
    });
    return IS_AUTHENTICATED;
  }

  isAnonymous(): Subject<any> {
    const IS_ANONYMOUS = new Subject();
    this.auth.onAuthStateChanged((user) => {
      IS_ANONYMOUS.next(user.isAnonymous);
    });
    return IS_ANONYMOUS;
  }


  currentUser(): Subject<any> {
    const CURRENT_USER = new Subject();
    CURRENT_USER.next(this.auth.currentUser);
    return CURRENT_USER;
  }

  userData(): Subject<any> | Observable<any> {
    if (this.server) {
      return fromPromise(this.auth.currentUser.getIdToken(true).then((idToken) => {
        return this.http.post(`https://www.googleapis.com/identitytoolkit/v3/relyingparty/getAccountInfo?key=${this.config.apiKey}`, {
          'idToken': idToken
        });
      }));
    }
    if (this.browser) {
      const USER_DATA = new Subject();
      this.auth.onAuthStateChanged((user) => {
        if (user) {
          USER_DATA.next({
            displayName: user.displayName,
            email: user.email,
            emailVerified: user.emailVerified,
            photoURL: user.photoURL,
            isAnonymous: user.isAnonymous,
            uid: user.uid,
            providerData: user.providerData,
            phoneNumber: user.phoneNumber
          });
        }
      });
      return USER_DATA;
    }
  }

  providers(email: string): Subject<any> | Observable<any> {
    if (this.server) {
      return this.http.post(`https://www.googleapis.com/identitytoolkit/v3/relyingparty/createAuthUri?key=${this.config.apiKey}`, {
        'identifier': email,
        // 'continueUri': ''
      });
    }
    if (this.browser) {
      const PROVIDERS = new Subject();
      this.auth.fetchProvidersForEmail(email).then(((providers) => {
        PROVIDERS.next(providers);
      }));
      return PROVIDERS;
    }
  }


  // ------------- Authentication Actions -----------------//

  signin(email: string, password: string): Observable<any> {
    if (this.server) {
      return this.http.post(`https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=${this.config.apiKey}`, {
        'email': email,
        'password': password,
        'returnSecureToken': true
      });
    }
    if (this.browser) {
      return fromPromise(this.auth.signInWithEmailAndPassword(email, password));
    }
  }

  signinAnonymously(): Observable<any> {
    if (this.server) {
      return this.http.post(`https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=${this.config.apiKey}`, {
        'returnSecureToken': true
      });
    }
    if (this.browser) {
      return fromPromise(this.auth.signInAnonymously());
    }
  }

  signup(email: string, password: string): Observable<any> {
    if (this.server) {
      return this.http.post(`https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=${this.config.apiKey}`, {
        'email': email,
        'password': password,
        'returnSecureToken': true
      });
    }
    if (this.browser) {
      return fromPromise(this.auth.createUserWithEmailAndPassword(email, password));
    }
  }

  signout(): Observable<any> {
    return fromPromise(this.auth.signOut());
  }


  updateProfile(data: { displayName: string | null, photoURL: string | null }) {
    if (this.server) {
      let deleteAttribute;
      if (data.displayName === null && data.photoURL === null) {
        deleteAttribute = '\'PHOTO_URL\' , \'DISPLAY_NAME\''
      } else if (data.displayName === null) {
        deleteAttribute = 'DISPLAY_NAME'
      } else if (data.photoURL === null) {
        deleteAttribute = 'PHOTO_URL'
      }
      return this.auth.currentUser.getIdToken(true).then((idToken) => {
        return this.http.post(`https://www.googleapis.com/identitytoolkit/v3/relyingparty/setAccountInfo?key=${this.config.apiKey}`, {
          'idToken': idToken,
          'displayName': data.displayName,
          'photoUrl': data.photoURL,
          'deleteAttribute': deleteAttribute,
          'returnSecureToken': true
        });
      });
    }
    if (this.browser) {
      return fromPromise(this.auth.currentUser.updateProfile(data));
    }
  }


  updateEmail(newEmail: string) {
    if (this.server) {
      return this.auth.currentUser.getIdToken(true).then((idToken) => {
        return this.http.post(`https://www.googleapis.com/identitytoolkit/v3/relyingparty/setAccountInfo?key=${this.config.apiKey}`, {
          'idToken': idToken,
          'email': newEmail,
          'returnSecureToken': true
        });
      });
    }
    if (this.browser) {
      return fromPromise(this.auth.currentUser.updateEmail(newEmail));
    }
  }

  updatePassword(newPassword: string) {
    if (this.server) {
      return this.auth.currentUser.getIdToken(true).then((idToken) => {
        return this.http.post(`https://www.googleapis.com/identitytoolkit/v3/relyingparty/setAccountInfo?key=${this.config.apiKey}`, {
          'idToken': idToken,
          'password': newPassword,
          'returnSecureToken': true
        });
      });
    }
    if (this.browser) {
      return fromPromise(this.auth.currentUser.updatePassword(newPassword));
    }
  }

  verifyPasswordResetCode(code: string): Observable<any> {
    if (this.server) {
      return this.http.post(`https://www.googleapis.com/identitytoolkit/v3/relyingparty/resetPassword?key=${this.config.apiKey}`, {
        'oobCode': code
      });
    }
    if (this.browser) {
      return fromPromise(this.auth.verifyPasswordResetCode(code));
    }
  }

  confirmPasswordReset(code: string, newPassword: string): Observable<any> {
    if (this.server) {
      return this.http.post(`https://www.googleapis.com/identitytoolkit/v3/relyingparty/resetPassword?key=${this.config.apiKey}`, {
        'oobCode': code,
        'newPassword': newPassword
      });
    }
    if (this.browser) {
      return fromPromise(this.auth.confirmPasswordReset(code, newPassword));
    }
  }


  relogin(credentials): Observable<any> {
    return fromPromise(this.auth.currentUser.reauthenticateWithCredential(credentials));
  }

  deletePermanently(): Observable<any> {
    if (this.server) {
      return fromPromise(this.auth.currentUser.getIdToken(true).then((idToken) => {
        return this.http.post(`https://www.googleapis.com/identitytoolkit/v3/relyingparty/deleteAccount?key=${this.config.apiKey}`, {
          'idToken': idToken
        });
      }));
    }
    if (this.browser) {
      return fromPromise(this.auth.currentUser.delete());
    }
  }


  // ------------- Authentication Emails Senders -----------------//

  sendEmailVerification(): Observable<any> {
    if (this.server) {
      return fromPromise(this.auth.currentUser.getIdToken(true).then((idToken) => {
        return this.http
          .post(`https://www.googleapis.com/identitytoolkit/v3/relyingparty/getOobConfirmationCode?key=${this.config.apiKey}`, {
            'requestType': 'VERIFY_EMAIL',
            'idToken': idToken
          });
      }));
    }
    if (this.browser) {
      return fromPromise(this.auth.currentUser.sendEmailVerification());
    }
  }

  // TODO: Confirm email verification

  sendPasswordResetEmail(email: string): Observable<any> {
    if (this.server) {
      return this.http.post(`https://www.googleapis.com/identitytoolkit/v3/relyingparty/getOobConfirmationCode?key=${this.config.apiKey}`, {
        'requestType': 'PASSWORD_RESET',
        'email': email
      });
    }
    if (this.browser) {
      return fromPromise(this.auth.sendPasswordResetEmail(email));
    }
  }

  // ------------- Linking Accounts and Providers -----------------//

  // TODO: Link with email/password
  // TODO: Unlink provider

}
