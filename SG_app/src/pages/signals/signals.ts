import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireStorage} from 'angularfire2/storage';
import firebase from 'firebase';


@IonicPage()
@Component({
  selector: 'page-signals',
  templateUrl: 'signals.html',
})
export class SignalsPage {
  user: any;
  songs: FirebaseListObservable<any>;
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
      this.songs = db.list('/songs');
    }

  ionViewDidLoad() {
    this.auth.authState.subscribe(data => {
      if(data){
        this.user = data.uid;
        console.log("loget")
      } else {
        console.log("not loget")
        this.navCtrl.setRoot("LoginPage");
      }
      console.log(data.uid);
    });
  }

  addSong(){
    let prompt = this.alertCtrl.create({
      title: 'Song Name',
      message: "Enter a name for this new song you're so keen on adding",
      inputs: [
        {
          name: 'title',
          placeholder: 'Title'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
            this.songs.push({
              title: data.title
            });
          }
        }
      ]
    });
    prompt.present();
  }

  display(img: string) {
    this.firestore.ref().child('images/logo_ionic.png/').getDownloadURL().then(
      function(url){}).catch(function(error){});
  }

}
