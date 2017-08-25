import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { FirebaseListObservable, AngularFireDatabase } from "angularfire2/database";
import { Storage } from '@ionic/storage';
import { Network } from "../../models/network";
import { UserNet } from "../../models/userNet";

@IonicPage()
@Component({
  selector: 'page-network',
  templateUrl: 'network.html',
})
export class NetworkPage {
  network: any;
  user: any;
  product: any;
  L1: any;
  L2: any;
  L3: any;
  L4: any;
  L5: any;
  TL: any;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private auth: AngularFireAuth, private db: AngularFireDatabase, private storage: Storage) {
      this.user = this.navParams.get('user');
      this.network = this.navParams.get('network');
      this.storage.get('Product').then(res =>{
        console.log(res);
        if(res == 'admin'){
          this.product = 'Account Management'
        } else {
          this.product = 'Signals'
        }
      })
      
      this.L1 = (this.network.Line1.length - 1)*(125*0.02);
      this.L2 = (this.network.Line2.length - 1)*(125*0.03);
      this.L3 = (this.network.Line3.length - 1)*(125*0.04);
      this.L4 = (this.network.Line4.length - 1)*(125*0.05);
      this.L5 = (this.network.Line5.length - 1)*(125*0.06);
      this.TL = this.L1 + this.L2 + this.L3 + this.L4 + this.L5;
    }

    get_data(){
      
    }
}
