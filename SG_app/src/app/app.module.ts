import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';

import { BrowserModule } from '@angular/platform-browser';
import { HttpModule, Http } from '@angular/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { MyApp } from './app.component';

import { InicioPage } from '../pages/inicio/inicio';
import { NetworkPage } from '../pages/network/network';
import { PerfilDetallePage } from '../pages/perfil-detalle/perfil-detalle';

import { ConfigPage } from '../pages/config/config';
import { SignalsPage } from '../pages/signals/signals';

import { PlaylistsPage } from '../pages/playlists/playlists';
import { CancionesPage } from '../pages/canciones/canciones';
import { CancionPopoverPage } from '../pages/cancion-popover/cancion-popover'

import { TecnoPlayerComponent } from '../components/tecno-player/tecno-player';

export function createTranslateLoader(http: Http) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    MyApp,

    InicioPage,
    NetworkPage,
    PerfilDetallePage,
    ConfigPage,
    SignalsPage,

    PlaylistsPage,
    CancionesPage,
    CancionPopoverPage,

    TecnoPlayerComponent
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
  })
],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    
    InicioPage,
    NetworkPage,
    PerfilDetallePage,
    ConfigPage,
    SignalsPage,

    PlaylistsPage,
    CancionesPage,
    CancionPopoverPage,

    TecnoPlayerComponent
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule {}
