import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ViewController} from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireStorage} from 'angularfire2/storage';
import { FileChooser, FilePath, File } from 'ionic-native';
import firebase from 'firebase';
import { SignalDetailsPage } from "../signal-details/signal-details";
import { Signal } from "../../models/signal";

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
    public zone: NgZone) {
      this.signals = db.list('/signals');
      this.history_signals = db.list('/history');
    }

    openNavDetailsPage(signal) {
      this.navCtrl.push(SignalDetailsPage, {Signal: signal});
    }
}
