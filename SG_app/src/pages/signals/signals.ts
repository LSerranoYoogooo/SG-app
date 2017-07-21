import { Component/*, NgZone*/ } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController /*, ViewController*/} from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { Push, PushToken } from '@ionic/cloud-angular';
//import { AngularFireStorage} from 'angularfire2/storage';
//import { FileChooser, FilePath, File } from 'ionic-native';
import firebase from 'firebase';
import { SignalDetailsPage } from "../signal-details/signal-details";
//import { Signal } from "../../models/signal";
//import { History } from "../../models/history";
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
    /*public zone: NgZone*/ ) {
      console.log("push suscribe");
      this.auth.authState.subscribe(data => {
        if(data){
          this.signals = db.list('/signals');
          this.history_signals = db.list('/history');
        } else {
          this.navCtrl.setRoot("LoginPage");
        }
      }).unsubscribe;
    }

    /*display(img: string) {
      this.firestore.ref().child(img).getDownloadURL().then((url) => {
        this.zone.run(() => {
          this.imgsource = url;
        })
      })
    }*/

    openNavSignalsDetailsPage(signal) {
      this.navCtrl.push(SignalDetailsPage, {Signal: signal});
    }

    openNavHistoryDetailsPage(history) {
      this.navCtrl.push(HistoryDetailsPage, {History: history});
    }

}
