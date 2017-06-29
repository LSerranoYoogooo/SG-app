import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';

import { BrowserModule } from '@angular/platform-browser';
import { HttpModule, Http } from '@angular/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule} from 'angularfire2/auth';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { MyApp } from './app.component';
import { FIREBASE_CONFIG } from './app.firebase.config';

import { NetworkPage } from '../pages/network/network';
import { ConfigPage } from '../pages/config/config';
import { SignalsPage } from '../pages/signals/signals';
import { LoginPage } from '../pages/login/login';
import { InicioPage } from "../pages/inicio/inicio";

export function createTranslateLoader(http: Http) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
@NgModule({
  declarations: [
    MyApp,
    InicioPage,
    NetworkPage,
    ConfigPage,
    SignalsPage,
    LoginPage
  ],
  imports: [
  BrowserModule,
  HttpModule,
  IonicModule.forRoot(MyApp),
  TranslateModule.forRoot({
    loader: {
      provide: TranslateLoader,
      useFactory: (createTranslateLoader),
      deps: [Http]
    }
  }),
  AngularFireModule.initializeApp(FIREBASE_CONFIG),
  AngularFireAuthModule
],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    InicioPage,
    NetworkPage,
    ConfigPage,
    SignalsPage,
    LoginPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule {}
