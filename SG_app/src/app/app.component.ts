import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, AlertController } from 'ionic-angular';
import { Push, PushToken } from '@ionic/cloud-angular';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AngularFireAuth } from 'angularfire2/auth';
//import { AngularFireDatabase } from 'angularfire2/database';
import { TranslateService } from '@ngx-translate/core';
import { SignalsPage } from "../pages/signals/signals";
import { NetworkPage } from "../pages/network/network";
import { ConfigurationPage } from "../pages/configuration/configuration";
import { VideosPage } from "../pages/videos/videos";
//import { InitialPage } from "../pages/initial/initial";


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild('NAV') nav: Nav;
  public rootPage: any;
  public pages: Array<{ titulo: string, component: any, icon: string }>;

  constructor(
    public platform: Platform, public statusBar: StatusBar,
    public splashScreen: SplashScreen, public translate: TranslateService,
    private auth: AngularFireAuth, public push: Push, public alertCtrl: AlertController
  ) {

    this.rootPage = SignalsPage;
    this.pages = [
      { titulo: 'btn_menu_Signal', component: SignalsPage, icon: 'analytics' },
      { titulo: 'btn_menu_Red', component: NetworkPage, icon: 'card' },
      { titulo: 'btn_menu_Videos', component: VideosPage, icon: 'videocam' },
      { titulo: 'btn_menu_Config', component: ConfigurationPage, icon: 'settings' }
    ];

    platform.ready().then(() => {
      translate.setDefaultLang('en');
      translate.use('en');
      statusBar.styleDefault();
      splashScreen.hide();
      this.RegisterNotificaction();
      this.Notification();
    });
  }

  goToPage(page) {
    this.nav.setRoot(page);
  }

  logOut() {
    this.auth.auth.signOut();
    this.UnRegisterNotification();
    this.nav.setRoot('LoginPage');
  }

  
  private RegisterNotificaction() {
    this.push.register().then((t: PushToken) => {
      return this.push.saveToken(t);
    }).then((t: PushToken) => {
      console.log('Token saved:', t.token);
    });
  }

  private Notification() {
    this.push.rx.notification()
      .subscribe((msg) => {
        alert(msg.title + ': ' + msg.text);
      });
  }

  private UnRegisterNotification(){
    this.push.unregister();
  }
  
}
