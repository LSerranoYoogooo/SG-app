import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController, Events, LoadingController } from 'ionic-angular';
import { User } from "../../models/user";
import { Storage } from '@ionic/storage';
import { AngularFireAuth } from "angularfire2/auth";
import { AngularFireDatabase } from "angularfire2/database";

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})

export class LoginPage {
  user = {} as User;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private auth: AngularFireAuth,
    private toast: ToastController,
    public alertCtrl: AlertController,
    private db: AngularFireDatabase,
    private storage: Storage,
    public events: Events,
    public loadingCtrl: LoadingController
  ){ 
    this.autoLogin();
  }

  private  autoLogin(){
    var Email_login = null;
    var Verified_state = null;
    try {
      this.storage.get('Email').then(res=>{
        Email_login = res
      });
      this.storage.get('Verified').then(res=>{
        Verified_state = res;
      });
      if(Verified_state){
        console.log('2'+Email_login + Verified_state);
        this.autoLoginReviewSession(Email_login)
      }
      console.log('1'+Email_login + Verified_state);
    } catch (error) {
      console.log(error);
    }
  }

  private async login(user: User){
    let loading = this.loadingCtrl.create({content : "Processing, please wait..."});
    loading.present();
    try {
      var Email_login;
      var Verified_state;
      await this.auth.auth.signInWithEmailAndPassword(user.email, user.password).then(res=>{
        Email_login = res.email;
        Verified_state = res.emailVerified;
      });
      if(Verified_state){
        this.loginReviewSession(Email_login, Verified_state);
        loading.dismissAll();
      } else {
        loading.dismissAll();
        this.auth.auth.signOut();
        let alert = this.alertCtrl.create({
          title: 'Confirm email!!!',
          subTitle: 'you must confirm your email, please check your email',
          buttons: ['OK']
        });
        alert.present();
      }
    }
    catch (e){
      console.log('error');
      loading.dismiss();
      if(e.code == "auth/argument-error"){
        this.toast.create({
          message: "Indicate email and password",
          duration: 2000
        }).present();
      } else if (e.code == "auth/user-not-found"){
        this.toast.create({
          message: "Invalid User",
          duration: 2000
        }).present();
      } else if (e.code == "auth/wrong-password"){
        this.toast.create({
          message: "Invalid Password",
          duration: 2000
        }).present();
      } else if (e.code == "auth/invalid-email"){
        this.toast.create({
          message: "Invalid Email",
          duration: 2000
        }).present();
      } else {
        this.toast.create({
          message: e.code,
          duration: 10000
        }).present();
      }
    }
  }

  private register() {
    this.navCtrl.push("RegisterPage");
  }

  private recover(){
    this.navCtrl.push("RecoverPage");
  }

  private resetPass(email: string) {
    let prompt = this.alertCtrl.create({
      title: 'Change Password',
      message: "please enter your email to send instructions.",
      inputs: [
        {
          name: 'email',
          placeholder: 'Email',
          type: 'email'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
          }
        },
        {
          text: 'Send',
          handler: data => {
            this.auth.auth.sendPasswordResetEmail(data.email);
          }
        }
      ]
    });
    prompt.present();
  }

  private reviewSessions(email: string){
    try{
      this.auth.authState.subscribe(data=>{
        if(data.emailVerified){
          if (data.uid){
            //this.auxReviewSession(email);
          }
        } else{
          let alert = this.alertCtrl.create({
            title: 'Confirm email!!!',
            subTitle: 'you must confirm your email, please check your email',
            buttons: ['OK']
          });
          alert.present();
        }
      }).unsubscribe();
    } catch (error){
      console.log(error);
    }
  }

  private loginReviewSession(email: string, verified: boolean){
    var product: string;
    this.db.list('/users', {
      query: {
        indexOn: 'Email',
        orderByChild: 'Email',
        equalTo: email
      }
    }).subscribe(snapshot => { 
      var c = snapshot.length;
      if(c >= 1){
        for (let user of snapshot){
          if(user.State == "true"){
            this.storage.set('Email', user.Email);
            this.storage.set('ReferCode', user.ReferCode);
            this.storage.set('Verified', verified)
            this.events.publish('userLoget', product, user.Product);
            if(user.Intro){
              this.navCtrl.setRoot("InitialPage");
            } else {
              if(user.Product == 'signal'){
                this.navCtrl.setRoot("SignalsPage");
              } else{
                this.navCtrl.setRoot("IbPage");
              }
            }
          } else{
            this.auth.auth.signOut();
            this.toast.create({
              message: "Unauthorized user",
              duration: 2000
            }).present();
          }
        }
      } 
    }).unsubscribe; 
  }

  private autoLoginReviewSession(email: string){
    var product: string;
    this.db.list('/users', {
      query: {
        indexOn: 'Email',
        orderByChild: 'Email',
        equalTo: email
      }
    }).subscribe(snapshot => { 
      var c = snapshot.length;
      if(c >= 1){
        for (let user of snapshot){
          if(user.State == "true"){
            this.events.publish('userLoget', product, user.Product);
            if(user.Intro){
              this.navCtrl.setRoot("InitialPage");
            } else {
              if(user.Product == 'signal'){
                this.navCtrl.setRoot("SignalsPage");
              } else{
                this.navCtrl.setRoot("IbPage");
              }
            }
          } else{
            this.auth.auth.signOut();
            this.toast.create({
              message: "Unauthorized user",
              duration: 2000
            }).present();
          }
        }
      } 
    }).unsubscribe; 
  }
}
