import { Component} from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController} from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { Push, PushToken } from '@ionic/cloud-angular';
import firebase from 'firebase';
import { Storage } from '@ionic/storage';
import { SignalDetailsPage } from "../signal-details/signal-details";
import { HistoryDetailsPage } from "../history-details/history-details";

@IonicPage()
@Component({
  selector: 'page-signals',
  templateUrl: 'signals.html',
})
export class SignalsPage {
  state: string = "signals";
  user: any;
  users: any;
  signals: FirebaseListObservable<any>;
  history_signals: FirebaseListObservable<any>;
  list_history_signals= [];
  nativepath: any;
  firestore = firebase.storage();
  imgsource: any;
  history_data_set: string = "Default";
  myDate: any = new Date().getMonth();
  date1: string;
  date2: string;
  date3: string;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public alertCtrl: AlertController,
    private auth: AngularFireAuth,
    private db: AngularFireDatabase,
    public push: Push,
    private storage: Storage
    ) {
      this.signals = db.list('/signals');
      //this.history_signals = db.list('/history');
      this.getHistorySignal(this.history_data_set);
    }

    openNavSignalsDetailsPage(signal) {
      this.navCtrl.push(SignalDetailsPage, {Signal: signal});
    }

    openNavHistoryDetailsPage(history) {
      this.navCtrl.push(HistoryDetailsPage, {History: history});
    }

    getHistorySignal(val: string){
      this.list_history_signals = [];
      this.auxGetDefault();
      if(val == 'Default'){
        this.db.list('/history').subscribe(snapshot=>{
          for (let HSignal of snapshot){
            if(HSignal.Month_Actual_Number == this.date1){
              this.list_history_signals.push(HSignal);
            }
            if(HSignal.Month_Actual_Number == this.date2){
              this.list_history_signals.push(HSignal);
            }
            if(HSignal.Month_Actual_Number == this.date3){
              this.list_history_signals.push(HSignal);
            }
          }
        })
      } else {
        this.db.list('/history', {
          query: {
            indexOn: 'Month_Actual_Number',
            orderByChild: 'Month_Actual_Number',
            equalTo: val
          }
        }).subscribe(snapshot => {
            for (let HSignal of snapshot){
              this.list_history_signals.push(HSignal);
          }
        });
      }
    }

    auxGetDefault(){
      if(this.myDate == 0){this.date1 = '0';this.date2 = '11';this.date3 = '10';}
      if(this.myDate == 1){this.date1 = '1';this.date2 = '0';this.date3 = '11';}
      if(this.myDate == 2){this.date1 = '2';this.date2 = '1';this.date3 = '0';}
      if(this.myDate == 3){this.date1 = '3';this.date2 = '2';this.date3 = '1';}
      if(this.myDate == 4){this.date1 = '4';this.date2 = '3';this.date3 = '2';}
      if(this.myDate == 5){this.date1 = '5';this.date2 = '4';this.date3 = '3';}
      if(this.myDate == 6){this.date1 = '6';this.date2 = '5';this.date3 = '4';}
      if(this.myDate == 7){this.date1 = '7';this.date2 = '6';this.date3 = '5';}
      if(this.myDate == 8){this.date1 = '8';this.date2 = '7';this.date3 = '6';}
      if(this.myDate == 9){this.date1 = '9';this.date2 = '8';this.date3 = '7';}
      if(this.myDate == 10){this.date1 = '10';this.date2 = '9';this.date3 = '8';}
      if(this.myDate == 11){this.date1 = '11';this.date2 = '10';this.date3 = '9';}
    }
}
