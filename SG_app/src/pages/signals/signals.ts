import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireStorage} from 'angularfire2/storage';
import { FileChooser, FilePath, File } from 'ionic-native';
import firebase from 'firebase';


@IonicPage()
@Component({
  selector: 'page-signals',
  templateUrl: 'signals.html',
})
export class SignalsPage {
  user: any;
  users: any;
  //songs: FirebaseListObservable<any>;
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
      //this.songs = db.list('/songs');
      /*this.db.list('/users').subscribe(users => this.users = users, 
        error => console.log(error)
      );*/
    }

  ionViewDidLoad() {
    this.auth.authState.subscribe(data => {
      if(data){
        //this.SearchSession();
        //this.user = data.uid;
        //console.log("loget")
      } else {
        //console.log("not loget")
        this.navCtrl.setRoot("LoginPage");
      }
      //console.log(data.uid);
    });
  }

  display() {
    this.firestore.ref().child('logo_ionic.png').getDownloadURL().then((url) => {
      this.zone.run(() => {
        this.imgsource = url;
       })
    })
  }

  /*SearchSession(){
    console.log("USERS REGISTRADOS");

    for (let entry of this.users) {
      console.log(entry);
    }
  }*/

  /*addSong(){
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
  }*/

}
