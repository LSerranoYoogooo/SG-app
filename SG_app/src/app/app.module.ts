import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';

import { BrowserModule } from '@angular/platform-browser';
import { HttpModule, Http } from '@angular/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule} from 'angularfire2/auth';

import { Push } from '@ionic-native/push';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { CloudSettings, CloudModule } from '@ionic/cloud-angular';

import { MyApp } from './app.component';
import { FIREBASE_CONFIG } from './app.firebase.config';
import { SignalsPageModule } from "../pages/signals/signals.module";
import { NetworkPageModule } from "../pages/network/network.module";
import { ConfigurationPageModule } from "../pages/configuration/configuration.module";

export function createTranslateLoader(http: Http) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

const cloudSettings: CloudSettings = {
  'core': {
    'app_id': '98107872'
  }
};

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
  BrowserModule,
  HttpModule,
  IonicModule.forRoot(MyApp),
  CloudModule.forRoot(cloudSettings),
  TranslateModule.forRoot({
    loader: {
      provide: TranslateLoader,
      useFactory: (createTranslateLoader),
      deps: [Http]
    }
  }),
  AngularFireModule.initializeApp(FIREBASE_CONFIG),
  AngularFireAuthModule,
  SignalsPageModule,
  NetworkPageModule,
  ConfigurationPageModule
],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Push,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule {}
