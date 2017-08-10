import { Component} from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController} from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { Push, PushToken } from '@ionic/cloud-angular';
import firebase from 'firebase';
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
  nativepath: any;
  firestore = firebase.storage();
  imgsource: any;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public alertCtrl: AlertController,
    private auth: AngularFireAuth,
    private db: AngularFireDatabase,
    public push: Push
    ) {
      this.auth.authState.subscribe(data => {
        if(data){
          this.signals = db.list('/signals');
          this.history_signals = db.list('/history');
        } else {
          this.navCtrl.setRoot("LoginPage");
        }
      }).unsubscribe;
    }

    openNavSignalsDetailsPage(signal) {
      this.navCtrl.push(SignalDetailsPage, {Signal: signal});
    }

    openNavHistoryDetailsPage(history) {
      this.navCtrl.push(HistoryDetailsPage, {History: history});
    }

}
