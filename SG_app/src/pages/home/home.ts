import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';


@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  constructor(public navCtrl: NavController, public navParams: NavParams,
  private auth: AngularFireAuth, private toast: ToastController) {
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad HomePage');
    this.auth.authState.subscribe(data => {
        if (data && data.email && data.uid){
          this.navCtrl.setRoot('HomePage');
        } 
        else {
          this.toast.create({
          message: 'Email / Password incorrects',
          duration: 3000
        }).present();
        this.navCtrl.setRoot('LoginPage');
        }
      })
  }

  

}
