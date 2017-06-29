import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';

@Component({
  selector: 'page-network',
  templateUrl: 'network.html',
})
export class NetworkPage {
  public users: any;
  public loader: any;

  constructor(public navCtrl:     NavController, public navParams:   NavParams) {

  }

}
