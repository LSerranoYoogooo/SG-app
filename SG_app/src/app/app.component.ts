import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, AlertController } from 'ionic-angular';
import { Push, PushToken } from '@ionic/cloud-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AngularFireAuth } from 'angularfire2/auth';
import { TranslateService } from '@ngx-translate/core';
import { SignalsPage } from "../pages/signals/signals";
import { NetworkPage } from "../pages/network/network";
import { VideosPage } from "../pages/videos/videos";
import { AngularFireDatabase } from "angularfire2/database";
import { UserNet } from "../models/userNet";
import { Network } from "../models/network";


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

  constructor(
    public platform: Platform, public statusBar: StatusBar,
    public splashScreen: SplashScreen, public translate: TranslateService,
    private auth: AngularFireAuth, public push: Push, public alertCtrl: AlertController,
    private db: AngularFireDatabase) {
    this.availableLang = ['es', 'en'];
    this.rootPage = SignalsPage;
    this.pages = [
      { titulo: 'btn_menu_Signal', component: SignalsPage, icon: 'analytics' },
      { titulo: 'btn_menu_Red', component: NetworkPage, icon: 'card' },
      { titulo: 'btn_menu_Videos', component: VideosPage, icon: 'videocam' }
    ];

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
    this.AuxUsrInfo().then( res => {
      this.UsrEmail = res;
      this.AuxUsrInfo2(this.UsrEmail).then(res => {
        this.UsrReferCode = res;
      }, error => {
        console.log(error);
      });
      },
      error =>{
        console.log(error);
      });
  }

  goToPage(page) {
    if(page = NetworkPage){
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

  AuxUsrInfo(){
    var email: string;
    return new Promise((resolve, reject) => {
      this.auth.authState.subscribe(data => {
        email = data.email;
        resolve(email);
      });
    });
  }

  private AuxUsrInfo2(email: string){
    var code;
    return new Promise((resolve, reject) => {
      this.db.list('/users', {
        query: {
          indexOn: 'Email',
          orderByChild: 'Email',
          equalTo: email
        }
      }).subscribe(snapshot => { 
        for (let user of snapshot){
          if(user.Email == email){
            code = user.ReferCode;
            resolve(code);
          }
        }
      }).unsubscribe;
    });
    
  }
  
}
