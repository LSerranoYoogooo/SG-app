import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { User } from "../../models/user";

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  user = {} as User;

  constructor(
    public navCtrl: NavController, public navParams: NavParams,
    private auth: AngularFireAuth, private toast: ToastController) {
  }

  async login(user: User){
    try {
      await this.auth.auth.signInWithEmailAndPassword(user.email, user.password);
      this.auth.authState.subscribe(data => {
        if (data.uid){
          this.navCtrl.setRoot("SignalsPage");
        } 
      })
    }
    catch (e){
      console.log(e.code);
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
          duration: 2000
        }).present();
      }
    }
  }

  register() {
    this.navCtrl.push("RegisterPage");
  }

  resetPass(email: string) {
    return this.auth.auth.sendPasswordResetEmail(email);
  }

}
