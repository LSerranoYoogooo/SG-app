import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-videos',
  templateUrl: 'videos.html',
})
export class VideosPage {

  videos: any[] = [{
      title: "video 1",
      video: "https://www.youtube.com/embed/ozv4q2ov3Mk"
    }, {
      title: "Tictoc",
      video: "https://www.youtube.com/embed/lJIrF4YjHfQ"
    }
  ]

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VideosPage');
  }

}
