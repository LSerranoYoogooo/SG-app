import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { User } from "../../models/user";
import { FirebaseListObservable, AngularFireDatabase, FirebaseObjectObservable } from "angularfire2/database";
import { UserInfo } from "../../models/userInfo";
import firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})

export class LoginPage {
  user = {} as User;

  constructor(
    public navCtrl: NavController, public navParams: NavParams,
    private auth: AngularFireAuth, private toast: ToastController,
    public alertCtrl: AlertController, private db: AngularFireDatabase) {
    }

  async login(user: User){
    try {
      await this.auth.auth.signInWithEmailAndPassword(user.email, user.password);
      this.auth.authState.subscribe(data => {
        if (data.uid){
          this.reviewSessions(data.email);
        } 
      })
    }
    catch (e){
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
          message: "Error",
          duration: 1000
        }).present();
      }
    }
  }

  register() {
    this.navCtrl.push("RegisterPage");
  }

  resetPass(email: string) {
    let prompt = this.alertCtrl.create({
      title: 'Change Password',
      message: "please enter your email to send instructions.",
      inputs: [
        {
          name: 'email',
          placeholder: 'Email'
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
    this.db.list('/users', {
      query: {
        indexOn: 'Email',
        orderByChild: 'Email',
        equalTo: email
      }
    }).subscribe(snapshot => { 
      for (let user of snapshot){
        if(user.Intro){
          this.navCtrl.setRoot("InitialPage");
        } else {
          this.navCtrl.setRoot("SignalsPage");
        }
      }
    }); 
  }
}
