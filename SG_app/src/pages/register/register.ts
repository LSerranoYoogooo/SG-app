import { Component,/* NgZone*/ } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { User } from '../../models/user';
import { AngularFireAuth } from 'angularfire2/auth';
import { FirebaseListObservable, AngularFireDatabase } from "angularfire2/database";

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {
  user = {} as User;
  users: FirebaseListObservable<any>;
  
  constructor(public navCtrl: NavController, public navParams: NavParams, 
    public toast: ToastController, public alertCtrl: AlertController,
    private auth: AngularFireAuth, private db: AngularFireDatabase,
    /*public zone: NgZone*/) {
      this.users = db.list('/users');
    }

  async register(user: User) {
    try{
      const result = await this.auth.auth.createUserWithEmailAndPassword(user.email, user.password);
      if (result)
        this.addUser(user.email);
        this.toast.create({
          message: 'Successful register',
          duration: 2000
        }).present();
        this.navCtrl.pop();
    }
    catch (e) {
      if(e.code == "auth/argument-error"){
        this.toast.create({
          message: "Indicate email and password",
          duration: 2000
        }).present();
      } else if (e.code == "auth/weak-password"){
        this.toast.create({
          message: "Password 6 characters long or more",
          duration: 2000
        }).present();
      } else if (e.code == "auth/invalid-email"){
        this.toast.create({
          message: "Invalid Email",
          duration: 2000
        }).present();
      } else if (e.code == "auth/email-already-in-use"){
        this.toast.create({
          message: "Email is already in use",
          duration: 2000
        }).present();
      } else {
        console.log(e);
        this.toast.create({
          message: "Error",
          duration: 1000
        }).present();
      }

    }
    
  }

  addUser(email: string){
    this.users.push({
      Email: email,
      Intro: '1'
    });
  }
}
