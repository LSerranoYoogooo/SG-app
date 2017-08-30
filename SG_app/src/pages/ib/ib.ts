import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams} from 'ionic-angular';
import { Account } from "../../models/account";
import { Storage } from '@ionic/storage';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { FirebaseListObservable, AngularFireDatabase, FirebaseObjectObservable } from "angularfire2/database";


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

  constructor(public navCtrl: NavController, public navParams: NavParams , private storage: Storage,
    public formBuilder: FormBuilder, private db: AngularFireDatabase) {
      this.myForm = this.createMyForm();
      this.getAccountsList();
  }

  saveAccount(){
    this.storage.get('ReferCode').then(data =>{
      var account = {
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
    console.log(key);
    var item: FirebaseObjectObservable<any>;
    item = this.db.object('/account/' + key);
    item.update({State: "0"});
    this.getAccountsList();
  }

  getAccountsList(){
    this.accounts = [];
    this.storage.get('ReferCode').then(data =>{
      //console.log(data);
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
          }
        }
      })
    });
  }

  

}


