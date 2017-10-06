import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Signal } from "../../models/signal";
import firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-signal-details',
  templateUrl: 'signal-details.html',
})
export class SignalDetailsPage {
  Signal: Signal;
  Trend: string;
  icon: string;
  firestore = firebase.storage();
  imgsource: any;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public zone: NgZone
  ) {
    this.Signal = navParams.data.Signal;
    if (this.Signal.E_Trend == "arrow-dropup-circle"){
      this.Trend = "Buy";
      this.icon = "md-trending-up"
    } else {
      this.Trend = "Sell";
      this.icon = "md-trending-down"
    }
    //console.log(this.Signal);
  }
}
