[![angularfire-lite-illustration](https://cdn.rawgit.com/hamedbaatour/ffd1020004cd8adc14535cebc53fc442/raw/086c6a7a5312ca326a0dc4582e98659865f3c6a3/ANGULAR%2520FIRE%2520ILLUSTARTION.svg)](#)

<p align="center">
  <h1 align="center">AngularFire Lite</h1>
    <p align="center">lightweight wrapper to use Firebase API with Angular.</p>
</p>

[![Travis](https://img.shields.io/travis/hamedbaatour/angularfire-lite.svg)](https://travis-ci.org/hamedbaatour/angularfire-lite)
[![CircleCI](https://circleci.com/gh/hamedbaatour/angularfire-lite.svg?style=shield)](https://circleci.com/gh/hamedbaatour/angularfire-lite)
[![npm version](https://badge.fury.io/js/angularfire-lite.svg)](https://www.npmjs.com/package/angularfire-lite)
[![dependencies Status](https://david-dm.org/hamedbaatour/angularfire-lite/status.svg)](https://david-dm.org/hamedbaatour/angularfire-lite)
[![Greenkeeper](https://badges.greenkeeper.io/hamedbaatour/angularfire-lite.svg)](#)
[![npm](https://img.shields.io/npm/dt/angularfire-lite.svg)](https://www.npmjs.com/package/angularfire-lite)
 [![Join the chat at https://gitter.im/angularfire-lite/Lobby](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/angularfire-lite/Lobby)


| Features              | AngularFire Lite         | AngularFire2  |
| -------------         |:-------------:|         :-------------------:  |
| Authentication        | :heavy_check_mark:    | :heavy_check_mark:     |
| Firestore             | :heavy_check_mark:    |  :heavy_check_mark:    |
| Storage               | :heavy_check_mark:    |  :x:                   |
| Realtime Database     | :heavy_check_mark:    |  :heavy_check_mark:    |
| Cloud Messaging       | :heavy_check_mark:    |  :x:                   |
| Server Side Rendering | :heavy_check_mark:    |  :x:                   |
| Transactions and Batched Writes | :heavy_check_mark: <br> Observable Based    |  :x:  |
| Size                  |   **75 KB** :zap:   | 	 **115 KB** :turtle: |

[![angluarfire-lite-ssr](https://cdn.rawgit.com/hamedbaatour/34003410a08925cb4301ce06fbc3936e/raw/91e29b8e406bb37404ab943519c374f1247957ec/SSR.svg)](#)
### Finally SSR with Firebase!
___

Angularfire Lite is the very first angular library to support server side rendering with firebase.
<br>
<br>
 - :file_folder: **Supports Both Firebase Databases: Firestore & Realtime Database**
 
 
 - :tada: **No Flickering whatsoever when the app bootstraps**
 
 - :zap:  **Better performance**
 
 - :mag: **Search engine optimization** 
  
 - :relaxed: **Easy implementation**

<p></p>
<p align="center">
  <h2 align="center">Getting Started</h2>
</p>

[![angularfire-lite-step-1](https://cdn.rawgit.com/hamedbaatour/a500be30a8520653d7759dfd248b535f/raw/7d0facd6691beadad8f74d22d44e68e4edc373fb/step1%2520-%2520angularfire-lite.svg)](#)

<br>

**Reminder**: don't forget to install [nodejs](https://nodejs.org/en/) first.

```bash
 
npm install --save angularfire-lite firebase
 
```
<br>

[![angularfire-lite-step-2](https://cdn.rawgit.com/hamedbaatour/9b22511bf9c59cfe1aab595bfd528c5d/raw/9e08922b4aee17d61f32bdb5500fa11a335e93e0/step%25202.svg)](#)

<br>

**How?**: 
- Create a firebase account and login to your dashboard

- Click on 'Add Firebase to your web app' icon and copy the config object

- Add it to `environment.ts` & `environment.prod.ts` located under `/src/environments/`

```ts
export const environment = {
  production: false, // production: true => in `enviroment.prod.ts`
  config: {
    apiKey: '<your-key>',
    authDomain: '<your-project-authdomain>',
    databaseURL: '<your-database-URL>',
    projectId: '<your-project-id>',
    storageBucket: '<your-storage-bucket>',
    messagingSenderId: '<your-messaging-sender-id>'
  }
};
```
<br>

[![angularfire-lite-step-3](https://cdn.rawgit.com/hamedbaatour/3855327ef6c4f7d22133a693231d6186/raw/956f99f36d834e15898e7712064f4316787f4185/step%25203.svg)](#)


**How?**: 
- Import the config object we created from `enviroment.ts`

- Import `AngularFireLite` and pass it the config object

```ts
import { AngularFireLite } from 'angularfire-lite';
import {environment} from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AngularFireLite.forRoot(environment.config)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

```

<br>

[![angularfire-lite-api](https://cdn.rawgit.com/hamedbaatour/f8c9581ab250d47e841d49ae7690ef82/raw/2cc67b7b2d1c29adbcdf3b7ea32a2de44439056a/api.svg)](#)

- **Observable based**: Every function returns an Observable that you should subscribe to it to get back the data.

- **Simple API**: AngularFire Lite has a simple straight forward syntax similar to the native Firebase API plus some simple additions.

<h3 align="center">:warning: In Progress :construction:</h3>

<h4 align="center">Full Documentation</h4>
<h4 align="center">Practical Examples</h4>

<br>

For now please use the Demo App as guide to get you started as I finish designing the new docs so check it out:

<br>

<h2 align="center"><a href="https://github.com/hamedbaatour/angularfire-lite-demo"> DEMO APP </a></h2>

<br>
<br>

[![angularfire-lite-faq](https://cdn.rawgit.com/hamedbaatour/fbbd36bce4d7e5a4ec0e07b71b71db15/raw/d58da0f50d52c27815832f7587b29d5b3d58eb3f/FAQ.svg)](#)

### Users
___

- **Will be there any breaking changes to AngularFire Lite?**

AngularFire Lite is still in beta so some changes may happen however we will try to avoid that as much as possible and keep the API consistent across all the firebase services provided.


### Contributors:
___

- **How can I contribute?**

We want to keep AngularFire Lite in sync with the Firebase API so if any new feature comes out don't hesitate to send a PR.

- **Why AngularFire Lite is so simple?**


Why add unnecessary complexity in simplicity draws a straight line to productivity.


- **Why there are no tests?**

currenty the demo is our primary test but there will be proper tests in the future.

<br>

[![angularfire-lite-credits](https://cdn.rawgit.com/hamedbaatour/fe2002a2acbdd15f3067b344de7eda3c/raw/3f3cb82cc4d528cc468be349ee5378b20c7c5a24/credits.svg)](#)


### Author:
___
<img src="https://cdn.rawgit.com/hamedbaatour/27ab12e194a559d3a7b5927565c37546/raw/bef25d518d9ed8f0781ca8a3edfd58f6691ef7ad/Angularfire-lite%2520author.svg" alt="angularfirelite-author" width="400px" height="500px">

### Maintainers:
___

Doors are open! I will personally design for you a maintainer card just like the one above too :wink:
