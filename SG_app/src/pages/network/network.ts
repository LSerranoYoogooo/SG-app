import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController, Events } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { FirebaseListObservable, AngularFireDatabase, FirebaseObjectObservable } from "angularfire2/database";
import { Storage } from '@ionic/storage';
import { Network } from "../../models/network";
import { UserNet } from "../../models/userNet";
import { FCM } from '@ionic-native/fcm';
import { User } from '../../models/user';
import { LoginPage } from '../login/login';

@IonicPage()
@Component({
  selector: 'page-network',
  templateUrl: 'network.html',
})
export class NetworkPage {
  network: any;
  user: any;
  product: any;
  L1: any; L2: any; L3: any; L4: any; L5: any; TL: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public events: Events,
    private toast: ToastController,
    private auth: AngularFireAuth,
    private db: AngularFireDatabase, 
    private storage: Storage,
    private alertCtrl: AlertController,
    private fcm: FCM
  ) {
      console.log('network');
      
      this.auth.authState.subscribe(data=>{
        console.log(data);
        if(data != null){
          this.user = this.navParams.get('user');
          this.network = this.navParams.get('network');
          console.log(this.user);
          console.log(this.network);
          if(this.user.Product == 'admin'){
            this.product = 'Account Management'
          } else {
            this.product = 'Signals'
          }
          this.L1 = (this.network.Line1.length - 1)*(125*0.02);
          this.L2 = (this.network.Line2.length - 1)*(125*0.03);
          this.L3 = (this.network.Line3.length - 1)*(125*0.04);
          this.L4 = (this.network.Line4.length - 1)*(125*0.05);
          this.L5 = (this.network.Line5.length - 1)*(125*0.06);
          this.TL = this.L1 + this.L2 + this.L3 + this.L4 + this.L5;
        } else {
          console.log('not login');
          navCtrl.setRoot(LoginPage);
        }
      });
      /*
      this.user = this.navParams.get('user');
      this.network = this.navParams.get('network');
      console.log(this.user);
      console.log(this.network);
      if(this.user.Product == 'admin'){
        this.product = 'Account Management'
      } else {
        this.product = 'Signals'
      }
      this.L1 = (this.network.Line1.length - 1)*(125*0.02);
      this.L2 = (this.network.Line2.length - 1)*(125*0.03);
      this.L3 = (this.network.Line3.length - 1)*(125*0.04);
      this.L4 = (this.network.Line4.length - 1)*(125*0.05);
      this.L5 = (this.network.Line5.length - 1)*(125*0.06);
      this.TL = this.L1 + this.L2 + this.L3 + this.L4 + this.L5;*/
      
    }

    private disableAccount(){
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
              this.auxDisableAccount(data.pass);
            }
          }
        ]
      });
      prompt.present();
    }

    private async auxDisableAccount(password: string){
      var Email_login;
      var Key;
      try {
        await this.storage.get('Email').then(res=>{
          Email_login = res
        });
        await this.searchUserKey(Email_login).then(res =>{
          Key = res
        });
        /*this.updateUser(Key);
        this.db.list('/disconnectUser').push({
          email: Email_login,
          pass: password
        });
        this.events.publish('goToLogin');*/
        

        await this.auth.auth.signInWithEmailAndPassword(Email_login,password).then(res =>{
          this.auth.auth.currentUser.delete();
          this.updateUser(Key);
          this.events.publish('goToLogin');
        });
      } catch (error) {
        if (error.code == "auth/wrong-password"){
          this.toast.create({
            message: "Invalid Password",
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

    private searchUserKey(email: string){
      var key = null;
      return new Promise((resolve, reject) => {
        this.db.list('/users', {
          query: {
            indexOn: 'Email',
            orderByChild: 'Email',
            equalTo: email
          }
        }).subscribe(snapshot => {
          for (let user of snapshot){
            key = user.$key;
          }
          resolve(key)
        });
      });
    }

    private updateUser(key: any){
      var item: FirebaseObjectObservable<any>;
      item = this.db.object('/users/' + key);
      item.update({State: "false"});
      this.fcm.unsubscribeFromTopic("Signals")
    }
}
