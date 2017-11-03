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
  networkA: any;
  networkS: any;
  user: any;
  product: any;
  //networkS: any;
  //networkA: Network;
  LS1= 0; LS2= 0; LS3= 0; LS4= 0; LS5= 0; TSL= 0;
  LA1= 0; LA2= 0; LA3= 0; LA4= 0; LA5= 0; TAL= 0;
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
      this.auth.authState.subscribe(data=>{
        if(data != null){
          this.user = this.navParams.get('user');
          if(this.user.Product == 'admin'){
            this.product = 'Account Management'
          } else {
            this.product = 'Signals'
          }
          if(this.user.Payment == "trial"){
            
          } else{
            this.networkA = this.navParams.get('networkA');
            this.networkS = this.navParams.get('networkS');
            console.log(this.networkA);
            console.log(this.networkS);

          }
        }else {
          navCtrl.setRoot(LoginPage);
        }
      });
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
    }

}
