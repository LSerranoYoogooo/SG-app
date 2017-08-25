import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, AlertController, Events } from 'ionic-angular';
import { Push, PushToken } from '@ionic/cloud-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AngularFireAuth } from 'angularfire2/auth';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';
import { SignalsPage } from "../pages/signals/signals";
import { NetworkPage } from "../pages/network/network";
import { VideosPage } from "../pages/videos/videos";
import { AngularFireDatabase } from "angularfire2/database";
import { UserNet } from "../models/userNet";
import { Network } from "../models/network";
import { IbPage } from "../pages/ib/ib";


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild('NAV') nav: Nav;
  public rootPage: any;
  public pages: Array<{ titulo: string, component: any, icon: string }>;
  private availableLang: Array<string>;
  public user: any;
  public UsrEmail: any;
  public UsrReferCode: any;
  public UsrProduct: string;

  constructor(
    public platform: Platform, public statusBar: StatusBar,
    public splashScreen: SplashScreen, public translate: TranslateService,
    private auth: AngularFireAuth, public push: Push, public alertCtrl: AlertController,
    private db: AngularFireDatabase, private storage: Storage, public events: Events) {
    this.availableLang = ['es', 'en'];
    this.rootPage = SignalsPage;

    try {
      storage.get('Product').then((val) => {
        if(val == 'signal'){
          this.pages = [
            { titulo: 'btn_menu_Signal', component: SignalsPage, icon: 'analytics' },
            { titulo: 'btn_menu_Red', component: NetworkPage, icon: 'card' },
            { titulo: 'btn_menu_Videos', component: VideosPage, icon: 'videocam' }
          ];
        } 
        if(val == 'admin') {
          this.pages = [
            { titulo: 'btn_menu_IB', component: IbPage, icon: 'ios-link' },
            { titulo: 'btn_menu_Red', component: NetworkPage, icon: 'card' },
            { titulo: 'btn_menu_Videos', component: VideosPage, icon: 'videocam' }
          ];
        }
        if(val == null) {
          this.pages = [
            { titulo: 'btn_menu_Videos', component: VideosPage, icon: 'videocam' }
          ];
        }
      });
    } catch (error) {
      console.log('not data');  
    }

    this.events.subscribe('userLoget', (product, val)=>{
      try {
        if(val == 'signal'){
          this.pages = [
            { titulo: 'btn_menu_Signal', component: SignalsPage, icon: 'analytics' },
            { titulo: 'btn_menu_Red', component: NetworkPage, icon: 'card' },
            { titulo: 'btn_menu_Videos', component: VideosPage, icon: 'videocam' }
          ];
        } 
        if(val == 'admin') {
          console.log('admin');
          this.pages = [
            { titulo: 'btn_menu_IB', component: IbPage, icon: 'ios-link' },
            { titulo: 'btn_menu_Red', component: NetworkPage, icon: 'card' },
            { titulo: 'btn_menu_Videos', component: VideosPage, icon: 'videocam' }
          ];
        }
        this.setUserinfo();
    } catch (error) {
      console.log('not data');
    }
    });
    

    platform.ready().then(() => {
      this.setUserinfo();
      statusBar.styleDefault();
      splashScreen.hide();
      this.RegisterNotificaction();
      this.Notification();
    });
  }

  setUserinfo(){
    this.AuxSetLang();
    this.storage.get('Email').then(res =>{
      this.UsrEmail = res;
    });
    this.storage.get('ReferCode').then(res =>{
      this.UsrReferCode = res;
    });
  }

  goToPage(page) {
    if(page == NetworkPage){
      var userNet: UserNet;
      var network: Network;
      this.auth.authState.subscribe(data => {
        this.db.list('/users', {query: {indexOn: 'Email', orderByChild: 'Email',equalTo: data.email}
          }).subscribe(UserList => { 
            for (let user of UserList){
              userNet = user;
              this.db.list('/network', {query: {indexOn: 'Reference', orderByChild: 'Reference',equalTo: userNet.ReferCode}
                }).subscribe(NetworkList => { 
                  for (let net of NetworkList){ 
                    network = net;
                    this.nav.setRoot(page, {user: userNet, network: network});
                  } 
                });
            }
          }).unsubscribe;
      });
    } else {
      this.nav.setRoot(page);
    }
  }

  logOut() {
    this.auth.auth.signOut();
    this.UnRegisterNotification();
    this.storage.remove('Country');
    this.storage.remove('Date');
    this.storage.remove('Email');
    this.storage.remove('Intro');
    this.storage.remove('Name');
    this.storage.remove('Product');
    this.storage.remove('ReferCode');
    this.storage.remove('State');
    this.storage.remove('Telephone');
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

  private AuxSetLang(){
    var dispLang = this.translate.getBrowserLang();
    var res: boolean;
    for (let lang of this.availableLang){
      if(lang == dispLang){
        res = true
      }
    }
    if(res){
      this.translate.setDefaultLang(dispLang);
      this.translate.use(dispLang);
    } else {
      this.translate.setDefaultLang('en');
      this.translate.use('en');
    }
  }
}
