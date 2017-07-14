import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FirebaseListObservable, AngularFireDatabase, FirebaseObjectObservable } from "angularfire2/database";
import { AngularFireAuth } from 'angularfire2/auth';
import firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-initial',
  templateUrl: 'initial.html',
})
export class InitialPage {
  slides = [
    {
      title: "Bienvenido a Sequeira Global",
      description: "En el siguiente video podras informate mas sobre nuestra plataforma",
      video: "https://www.youtube.com/embed/lJIrF4YjHfQ",
    },
    {
      title: "Meta Trader 4",
      description: "Plataforma de inversion.",
      video: "https://www.youtube.com/embed/lJIrF4YjHfQ",
    },
    {
      title: "Iron Fx",
      description: "Te recomendamos el mejor broker",
      video: "https://www.youtube.com/embed/lJIrF4YjHfQ",
    }
  ];

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private db: AngularFireDatabase, private auth: AngularFireAuth,) {
  }

  ionViewDidLoad() {
    
  }

  Continue(){
    this.navCtrl.setRoot("SignalsPage");
  }

  DontShow(){
    var email;
    var uid;
    var item: FirebaseObjectObservable<any>;

    this.auth.authState.subscribe(data => {
      email = data.email;
    }).unsubscribe;

    this.db.list('/users', {
      query: {
        indexOn: 'Email',
        orderByChild: 'Email',
        equalTo: email
      }
    }).subscribe(snapshot => { 
      for (let user of snapshot){
        if(user.Email == email){
          uid = user.$key;
          item = this.db.object('/users/' + user.$key);
          item.update({Intro: false});
          item._finally;
        }
      }
    }).unsubscribe;
  }

}
