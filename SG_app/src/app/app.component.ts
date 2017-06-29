import { Component, ViewChild } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TranslateService } from '@ngx-translate/core';

import { HomePage } from "../pages/home/home";
import { NetworkPage } from '../pages/network/network';
import { ConfigPage } from '../pages/config/config';
import { SignalsPage } from '../pages/signals/signals';
import { LoginPage } from '../pages/login/login';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild('NAV') nav: Nav;
  public rootPage: any;
  public pages: Array<{ titulo: string, component: any, icon: string }>;

  constructor(
    platform:     Platform,
    statusBar:    StatusBar,
    splashScreen: SplashScreen,
    translate: TranslateService
  ) {

    this.rootPage = LoginPage;
    this.pages = [
      { titulo: 'mn_Signal', component: SignalsPage,   icon: 'analytics'},
      { titulo: 'mn_Red', component: NetworkPage, icon: 'card'},
      { titulo: 'mn_Config', component: ConfigPage, icon: 'settings'},
      { titulo: 'mn_About', component: HomePage,   icon: 'information-circle'}
    ];

    platform.ready().then(() => {
      translate.setDefaultLang('en');
      translate.use('en');
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  goToPage(page){
    this.nav.setRoot(page);
  }

}
