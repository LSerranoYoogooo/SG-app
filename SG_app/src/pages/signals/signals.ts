import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';

@IonicPage()
@Component({
  selector: 'page-signals',
  templateUrl: 'signals.html',
})
export class SignalsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,
  private auth: AngularFireAuth) {
  }

  ionViewDidLoad() {
    this.auth.authState.subscribe(data => {
      if(data){
        console.log("loget")
      } else {
        console.log("not loget")
        this.navCtrl.setRoot("LoginPage");
      }
     // console.log(data);
    });
  }

}
