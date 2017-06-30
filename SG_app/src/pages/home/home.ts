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
    this.auth.authState.subscribe(data => {
      try{
        if (data.uid){} 
      }  
      catch(e){
        console.log(e);
        this.navCtrl.setRoot("LoginPage");
      }
    });
  }
  

}
