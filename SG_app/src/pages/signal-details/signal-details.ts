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
    } else {
      this.Trend = "Sell";
    }
    this.display(this.Signal.Img_E);
  }

  display(img: string) {
    this.firestore.ref().child("ImgEstimated/" + img).getDownloadURL().then((url) => {
      this.zone.run(() => {
        this.imgsource = url;
       })
    })
  }

}
