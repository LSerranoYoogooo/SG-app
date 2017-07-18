import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { History } from "../../models/history";
import firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-history-details',
  templateUrl: 'history-details.html',
})
export class HistoryDetailsPage {
  History: History;
  Trend_E: string;
  Trend_R: string;
  firestore = firebase.storage();
  imgsource: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public zone: NgZone) {
                this.History = navParams.data.History;
                if (this.History.E_Trend == "arrow-dropup-circle"){
                  this.Trend_E = "label_trend_A";
                } else {
                  this.Trend_E = "label_trend_B";
                }

                if (this.History.R_Trend == "arrow-dropup-circle"){
                  this.Trend_R = "label_trend_A";
                } else {
                  this.Trend_R = "label_trend_B";
                }
                this.displayE(this.History.Img_R);

              }

  displayE(img: string) {
    this.firestore.ref().child("ImgReal/" + img).getDownloadURL().then((url) => {
      this.zone.run(() => {
        this.imgsource = url;
       })
    })
  }

}
