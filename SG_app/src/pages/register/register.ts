import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { User } from '../../models/user';
import { AngularFireAuth } from 'angularfire2/auth';

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {
  user = {} as User;
  
  constructor(
    public navCtrl: NavController, public navParams: NavParams, 
    public toast: ToastController, 
    private auth: AngularFireAuth ) {
  }

  async register(user: User) {
    try{
      const result = await this.auth.auth.createUserWithEmailAndPassword(user.email, user.password);
      if (result)
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
      }

    }
    
  }
}
