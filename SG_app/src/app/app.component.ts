import { Component, ViewChild, NgZone } from '@angular/core';
import { Platform, Nav, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AngularFireAuth } from 'angularfire2/auth';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';
import { SignalsPage } from "../pages/signals/signals";
import { NetworkPage } from "../pages/network/network";
//import { VideosPage } from "../pages/videos/videos";
import { AngularFireDatabase } from "angularfire2/database";
import { UserNet } from "../models/userNet";
import { Network } from "../models/network";
import { IbPage } from "../pages/ib/ib";
import { LoginPage } from "../pages/login/login";
import { FCM } from '@ionic-native/fcm';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild('NAV') nav: Nav;
  public rootPage: any = LoginPage;
  public pages: Array<{ titulo: string, component: any, icon: string }>;
  private availableLang: Array<string>;
  public user: any;
  public UsrEmail: any;
  public UsrReferCode: any;
  public UsrProduct: string;

  constructor(
    public platform: Platform, 
    public statusBar: StatusBar,
    public splashScreen: SplashScreen, 
    private translate: TranslateService,
    private auth: AngularFireAuth, 
    private fcm: FCM,
    private db: AngularFireDatabase, 
    private storage: Storage, 
    public events: Events, 
    public zone: NgZone,
  ) {

      this.availableLang = ['es', 'en'];  //lista de idiomas aceptados
      this.rootPage = LoginPage;
      
      try {
        storage.get('Product').then((val) => {
          if(val == 'signal'){
            this.pages = [
              { titulo: 'btn_menu_Signal', component: SignalsPage, icon: 'analytics' },
              { titulo: 'btn_menu_Red', component: NetworkPage, icon: 'card' },
              //{ titulo: 'btn_menu_Videos', component: VideosPage, icon: 'videocam' } //a la espera de lo videos
            ];
          } 
          if(val == 'admin') {
            this.pages = [
              { titulo: 'btn_menu_IB', component: IbPage, icon: 'ios-link' },
              { titulo: 'btn_menu_Red', component: NetworkPage, icon: 'card' },
              //{ titulo: 'btn_menu_Videos', component: VideosPage, icon: 'videocam' } a la espera de los videos
            ];
          }
          if(val == null) {
            this.pages = [
              //{ titulo: 'btn_menu_Videos', component: VideosPage, icon: 'videocam' } a la espera de los videos
            ];
          }
        });
      } catch (error) {
        console.log('not data');
      }

      this.events.subscribe('userLoget', (product, val)=>{ //evento nuevo usuario conectado
        try {
          if(val == 'signal'){
            this.pages = [
              { titulo: 'btn_menu_Signal', component: SignalsPage, icon: 'analytics' },
              { titulo: 'btn_menu_Red', component: NetworkPage, icon: 'card' },
              //{ titulo: 'btn_menu_Videos', component: VideosPage, icon: 'videocam' }
            ];
          } 
          if(val == 'admin') {
            this.pages = [
              { titulo: 'btn_menu_IB', component: IbPage, icon: 'ios-link' },
              { titulo: 'btn_menu_Red', component: NetworkPage, icon: 'card' },
              //{ titulo: 'btn_menu_Videos', component: VideosPage, icon: 'videocam' }
            ];
          }
          this.setUserinfo();
      } catch (error) {
        console.log('not data');
        }
      });

      this.events.subscribe('goToLogin', val =>{
        this.logOut();
      });
      
      platform.ready().then(() => {
        this.setUserinfo();
        statusBar.styleDefault();
        //splashScreen.hide();
        setTimeout(()=>{
          splashScreen.hide();
        }, 100)
      });
  }

  private setUserinfo(){ //carga de informacion basica del usario a mostrar en el menu lateral
    this.AuxSetLang();
    this.storage.get('Email').then(res =>{
      this.UsrEmail = res;
    });
    this.storage.get('ReferCode').then(res =>{
      this.UsrReferCode = res;
    });
  }

  private goToPage(page) { //redirecconamiento a las distintas pantallas, en caso de visitar network se envia la info correspondiente al usuario
    if(page == NetworkPage){
      this.auxGoToNetwork(page)
    } else {
      this.nav.setRoot(page);
    }
  }

  private  auxGoToNetwork(page: any){
    var Email_login;
    this.storage.get('Email').then(res=>{
      this.searchUser(res, page);
    });
  }

  private searchUser(email: string, page: any){
    this.db.list('/users', {
      query: {
        indexOn: 'Email',
        orderByChild: 'Email',
        equalTo: email
      }
    }).subscribe(snapshot => {
      for (let user of snapshot){
        this.storage.set('userInfo', user);
        this.searchNetwork(user, page);
      }
    });
  }

  private searchNetwork(User: any, page: any){
    this.db.list('/network', {
      query: {
        indexOn: 'Reference',
        orderByChild: 'Reference',
        equalTo: User.ReferCode
      }
    }).subscribe(snapshot => {
      for (let network of snapshot){
        this.storage.set('networkInfo', network);
        this.nav.setRoot(page, {user: User, network: network});
      }
    });
  }

  private logOut() { //cierre de session y eliminiacion de toda la info almacenada del usuario
    this.UnSuscribeTopic();
    this.auth.auth.signOut();
    this.storage.remove('Email');
    this.storage.remove('ReferCode');
    this.storage.remove('Verified');
    this.nav.setRoot(LoginPage);
  }

  private AuxSetLang(){ //set del lenguaje a mostrar, si este se encuentra en la lista de idiomas permitidos, caso contrario ingles por default
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

  private UnSuscribeTopic(){ //Suscripcion a alertas
    this.fcm.unsubscribeFromTopic("Signals")
  }  
}
