import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';

import { AuthProvider} from '../providers/auth-provider';

import { AngularFireModule, AuthProviders, AuthMethods  } from 'angularfire2';

export const firebaseConfig = {
    apiKey: "AIzaSyDCnZEuPU72V0UpVrveJU7eB3kjze8pxOw",
    authDomain: "sequeiraglobal.firebaseapp.com",
    databaseURL: "https://sequeiraglobal.firebaseio.com",
    storageBucket: "sequeiraglobal.appspot.com",
    messagingSenderId: "503332807539"

  };

const myFirebaseAuthConfig = {
  provider: AuthProviders.Password,
  method: AuthMethods.Password
}

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig,myFirebaseAuthConfig)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler},
  AuthProvider]
})
export class AppModule {}
