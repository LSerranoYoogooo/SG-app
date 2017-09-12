import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController} from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { AngularFireDatabase, FirebaseObjectObservable } from "angularfire2/database";


@IonicPage()
@Component({
  selector: 'page-ib',
  templateUrl: 'ib.html',
})
export class IbPage {
  myForm: FormGroup;
  broker: any;
  brokerId: any;
  password: any;
  accounts = [];
  accountsSize: any;
  brokerList = [];
  loading: any;

  constructor(public navCtrl: NavController, public navParams: NavParams , private storage: Storage, public formBuilder: FormBuilder, private db: AngularFireDatabase, public alertCtrl: AlertController, public loadingCtrl: LoadingController){
    this.myForm = this.createMyForm();
    this.getAccountsList(); 
  }

  showConfirm(key: string) {
    let confirm = this.alertCtrl.create({
      title: 'Delete confirmation',
      message: 'Are you sure you want to delete the account?',
      buttons: [
        {
          text: 'No',
          handler: () => {}
        },
        {
          text: 'Yes',
          handler: () => {
            this.deleteAccount(key);
          }
        }
      ]
    });
    confirm.present();
  }

  saveAccount(){
    let loading = this.loadingCtrl.create({content: 'Loading...'});
    loading.present();
    this.storage.get('ReferCode').then(data =>{
      var account = {
        Block: 'false',
        Broker: this.broker,
        BrokerID: this.brokerId,
        Password: this.password,
        UsrReference: data,
        State: '1'
      }
      this.db.list('account').push(account);
    }).then(res => {
      this.broker = null;
      this.brokerId = null;
      this.password = null;
      this.getAccountsList();
      loading.dismiss();
    })    
  }

  private createMyForm(){
    return this.formBuilder.group({
      Broker: ['', Validators.required],
      BrokerID: ['', Validators.required],
      Password: ['', Validators.required],
    });
  }

  deleteAccount(key: string){
    var item: FirebaseObjectObservable<any>;
    item = this.db.object('/account/' + key);
    item.update({State: "0"});
    this.getAccountsList();
  }

  getAccountsList(){
    var bro: any;
    this.accounts = [];
    this.storage.get('ReferCode').then(data =>{
      this.db.list('/account', {
        query: {
          indexOn: 'UsrReference',
          orderByChild: 'UsrReference',
          equalTo: data
        }
      }).subscribe(snapshot => {
          for (let account of snapshot){
            if(account.State > 0){
              this.accounts.push(account)
              bro = account.Broker;
            }
        }
        this.countAccounts();
        this.setBrokerList(bro);
      });
    });
  }

  countAccounts(){
    if(this.accounts.length >= 3){
      this.accountsSize = true;
    } else{
      this.accountsSize = false;
    }
  }

  setBrokerList(broker: string){
    this.brokerList = [];
    if(this.accounts.length == 0){
      this.brokerList.push({Broker: 'IronFX'});
      this.brokerList.push({Broker: 'Interactive Brokers'});
    } else {
      this.brokerList.push({Broker: broker});
    }
  }
}
