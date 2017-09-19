import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { FirebaseListObservable, AngularFireDatabase, FirebaseObjectObservable } from "angularfire2/database";
import { Storage } from '@ionic/storage';
import { Network } from "../../models/network";
import { UserNet } from "../../models/userNet";
import { FCM } from '@ionic-native/fcm';

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
    private auth: AngularFireAuth, private db: AngularFireDatabase, 
    private storage: Storage, private alertCtrl: AlertController, private fcm: FCM) {
      this.user = this.navParams.get('user');
      this.network = this.navParams.get('network');
      this.storage.get('Product').then(res =>{
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

    disableAccount(){

      let prompt = this.alertCtrl.create({
        title: 'Disable Account',
        message: "Please enter your password",
        inputs: [
          {
            name: 'pass',
            placeholder: 'Password',
            type: "password"
          },
        ],
        buttons: [
          {
            text: 'Cancel',
            handler: data => {
            }
          },
          {
            text: 'OK',
            handler: data => {

              var currentUID;
              var currentEmail;
              this.auth.authState.subscribe(dataAuth => {
                currentUID = dataAuth.uid;
                currentEmail = dataAuth.email;
                this.auth.auth.signInWithEmailAndPassword(currentEmail, data.pass).then(res =>{
                  this.auth.auth.currentUser.delete();
                  this.db.list('/users', {
                    query: {
                      indexOn: 'Email',
                      orderByChild: 'Email',
                      equalTo: currentEmail
                    }
                  }).subscribe(snapshot => {
                    for (let user of snapshot){
                      this.updateUser(user.$key);
                      this.logOut();
                    }
                  });
                });
              })
              
              console.log(data);
            }
          }
        ]
      });
      prompt.present();
     }

    updateUser(key: string){
      var item: FirebaseObjectObservable<any>;
      item = this.db.object('/users/' + key);
      item.update({State: "false"});
    }

    logOut() {
      this.UnSuscribeTopic();
      this.auth.auth.signOut();
      this.navCtrl.setRoot('LoginPage');
      this.storage.remove('Country');
      this.storage.remove('Date');
      this.storage.remove('Email');
      this.storage.remove('Intro');
      this.storage.remove('Name');
      this.storage.remove('Product');
      this.storage.remove('ReferCode');
      this.storage.remove('State');
      this.storage.remove('Telephone'); 
    }

    private UnSuscribeTopic(){
      this.fcm.unsubscribeFromTopic("Signals")
    }
}
