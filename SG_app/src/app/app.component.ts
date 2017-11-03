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
        splashScreen.hide();
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
    var Email_login: any = null;
    var User: any = null;
    var NetworkS: any = null;
    var NetworkA: any = null;
    this.storage.get('Email').then(email=>{
      this.searchUser(email).then(user =>{
        User = user;
        this.searchNetwork(User.ReferCode).then(network =>{
          this.prepareNetSignal(network).then(res=>{
            NetworkS = res;
            this.prepareNetAdmin(network).then(res2 =>{
              NetworkA = res2;
              this.nav.setRoot(page, {user: User, networkS: NetworkS, networkA: NetworkA});
            })
          })
        })
      });
    });
  }

  private  searchUser(email: string){
    return new Promise((resolve, reject) => {
      this.db.list('/users', {
        query: {
          indexOn: 'Email',
          orderByChild: 'Email',
          equalTo: email
        }
      }).subscribe(snapshot => {
        for (let user of snapshot){
          resolve(user)
        }
      }).unsubscribe;
    }) 
  }

  private searchNetwork(reference){
    return new Promise((resolve, reject) => {
      this.db.list('/network', {
        query: {
          indexOn: 'Reference',
          orderByChild: 'Reference',
          equalTo: reference
        }
      }).subscribe(snapshot => {
        for (let network of snapshot){
          resolve(network);
        }
      });
    })
  }

  private prepareNetSignal(network: any){
    var networkS= {
      FatherReference: "0", Reference: "0",
      Line1: [], Line2: [], Line3: [], Line4: [], Line5: []
    };
    return new Promise((resolve, reject) => {
      for(let netL1 of network.Line1){
        if(netL1.Payment == "pay"){
          if(netL1.Product == "signal"){
            networkS.Line1.push(netL1)
          }
        }
      }
      for(let netL2 of network.Line2){
        if(netL2.Payment == "pay"){
          if(netL2.Product == "signal"){
            networkS.Line2.push(netL2)
          }
        }
      }
      for(let netL3 of network.Line3){
        if(netL3.Payment == "pay"){
          if(netL3.Product == "signal"){
            networkS.Line3.push(netL3)
          }
        }
      }
      for(let netL4 of network.Line4){
        if(netL4.Payment == "pay"){
          if(netL4.Product == "signal"){
            networkS.Line4.push(netL4)
          }
        }
      }
      for(let netL5 of network.Line5){
        if(netL5.Payment == "pay"){
          if(netL5.Product == "signal"){
            networkS.Line5.push(netL5)
          }
        }
      }
      networkS.FatherReference = network.FatherReference;
      networkS.Reference = network.Reference;
    resolve(networkS);
    })
  }

  private prepareNetAdmin(network: any){
    var networkA= {
      FatherReference: "0", Reference: "0",
      Line1: [], Line2: [], Line3: [], Line4: [], Line5: []
    };
    return new Promise((resolve, reject) => {
      for(let netL1 of network.Line1){
        if(netL1.Payment == "pay"){
          if(netL1.Product == "admin"){
            this.auxNetAdmin(netL1.Reference).then(amount =>{
              if(amount != null){
                netL1.Amount = amount;
                networkA.Line1.push(netL1)
              }
              else{
                netL1.Amount = "0";
                networkA.Line1.push(netL1)
              }
            })
            
          }
        }
      }
      for(let netL2 of network.Line2){
        if(netL2.Payment == "pay"){
          if(netL2.Product == "admin"){
            this.auxNetAdmin(netL2.Reference).then(amount =>{
              if(amount != null){
                netL2.Amount = amount;
                networkA.Line2.push(netL2)
              }
              else{
                netL2.Amount = "0";
                networkA.Line2.push(netL2)
              }
            })
          }
        }
      }
      for(let netL3 of network.Line3){
        if(netL3.Payment == "pay"){
          if(netL3.Product == "admin"){
            this.auxNetAdmin(netL3.Reference).then(amount =>{
              if(amount != null){
                netL3.Amount = amount;
                networkA.Line3.push(netL3)
              }
              else{
                netL3.Amount = "0";
                networkA.Line3.push(netL3)
              }
            })
          }
        }
      }
      for(let netL4 of network.Line4){
        if(netL4.Payment == "pay"){
          if(netL4.Product == "admin"){
            this.auxNetAdmin(netL4.Reference).then(amount =>{
              if(amount != null){
                netL4.Amount = amount;
                networkA.Line4.push(netL4)
              }
              else{
                netL4.Amount = "0";
                networkA.Line4.push(netL4)
              }
            })
          }
        }
      }
      for(let netL5 of network.Line5){
        if(netL5.Payment == "pay"){
          if(netL5.Product == "admin"){
            this.auxNetAdmin(netL5.Reference).then(amount =>{
              if(amount != null){
                netL5.Amount = amount;
                networkA.Line5.push(netL5)
              }
              else{
                netL5.Amount = "0";
                networkA.Line5.push(netL5)
              }
            })
          }
        }
      }
      networkA.FatherReference = network.FatherReference;
      networkA.Reference = network.Reference;
    resolve(networkA);
    })
  }

  private auxNetAdmin(reference: string){
    return new Promise((resolve, reject) => {
      this.db.list('/clientAccount', {
        query: {
          indexOn: 'User_reference',
          orderByChild: 'User_reference',
          equalTo: reference,
        }
      }).subscribe(clientAccounts => {
        for(let account of clientAccounts){
          if(account.State == "1"){
            resolve(account.Amount);
          }
        }
      })
    })
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
