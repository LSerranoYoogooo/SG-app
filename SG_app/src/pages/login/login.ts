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
      this.auth.auth.signInWithEmailAndPassword(user.email, user.password);
      console.log(this.auth.idToken);
      /*this.auth.authState.subscribe(data => {
        if (data && data.email && data.uid){
          this.navCtrl.setRoot('HomePage');
        } 
        else {
          this.toast.create({
          message: 'Email / Password incorrects',
          duration: 3000
          }).present();
        }
      })*/
      /*if (result){
        this.navCtrl.setRoot('HomePage');
      }*/
    }
    catch (e){
      console.log(e);
      this.toast.create({
        message: 'Email / Password incorrects',
        duration: 2000
      }).present();
    }
    
  }

  register() {
    this.navCtrl.push("RegisterPage");
  }
}
