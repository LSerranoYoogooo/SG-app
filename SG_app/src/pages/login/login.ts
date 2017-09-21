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

  private async autoLogin(){
    try {
      await this.auth.authState.subscribe(data=>{
        console.log(data.uid);
          try {
            if(data.uid != null){
              console.log('review');
              this.reviewSessions(data.email);
            }
          } catch (error) {
            console.log('not uid, try 2');
          }
        });
    } catch (error) {
      console.log('not uid, try 1');
    }
    
  }

  private async login(user: User){
    let loading = this.loadingCtrl.create({content : "Processing, please wait..."});
    loading.present();
    try {
      await this.auth.auth.signInWithEmailAndPassword(user.email, user.password);
      this.auth.authState.subscribe(data => {
        console.log(data);
        if (data.uid){
          this.reviewSessions(data.email);
          loading.dismissAll();
        } 
      })
    }
    catch (e){
      loading.dismissAll();
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

  resetPass(email: string) {
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

  reviewSessions(email: string){
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
            this.storage.set('Country', user.Country);
            this.storage.set('Date', user.Date);
            this.storage.set('Email', user.Email);
            this.storage.set('Intro', user.Intro);
            this.storage.set('Name', user.Name);
            this.storage.set('Product', user.Product);
            this.storage.set('ReferCode', user.ReferCode);
            this.storage.set('State', user.State);
            this.storage.set('Telephone', user.Telephone);
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
            this.toast.create({
              message: "Unauthorized user",
              duration: 2000
            }).present();
          }
      }
    } else{
      this.toast.create({
        message: "Unauthorized user",
        duration: 2000
      }).present();
    }   
    }).closed; 
  }
}
