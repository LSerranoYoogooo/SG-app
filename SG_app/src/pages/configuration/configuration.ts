import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { User } from "../../models/user";
import { AngularFireDatabase, FirebaseObjectObservable } from "angularfire2/database";
import { TranslateService } from "@ngx-translate/core";

@IonicPage()
@Component({
  selector: 'page-configuration',
  templateUrl: 'configuration.html',
})
export class ConfigurationPage {
  UsrEmail: any;
  UsrCode: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
  private auth: AngularFireAuth, private db: AngularFireDatabase,
  public translateService: TranslateService) {
  }

  ionViewDidLoad() {
    this.userData();
    console.log(this.translateService.getBrowserLang())
  }

  userData(){
    this.auth.authState.subscribe(data => {
      this.db.list('/users', {
        query: {
          indexOn: 'Email',
          orderByChild: 'Email',
          equalTo: 'a@a.com'
        }
      }).subscribe(snapshot => { 
        for (let user of snapshot){
          console.log(user);
          this.UsrEmail = user.Email;
          this.UsrCode = user.ReferCode;
        }
      }).unsubscribe;
    }).unsubscribe;
  }

  /*updateLanguage(lang: string){
    var item: FirebaseObjectObservable<any>;

    this.db.list('/users', {
      query: {
        indexOn: 'Email',
        orderByChild: 'Email',
        equalTo: this.UsrEmail
      }
    }).subscribe(snapshot => { 
      for (let user of snapshot){
        if(user.Email == this.UsrEmail){
          item = this.db.object('/users/' + user.$key);
          item.update({Languaje: lang});
        }
      }
    }).unsubscribe;
    item.update({Languaje: lang});
  }*/

  translateToSpanish(){
    this.translateService.use('es');
    //this.updateLanguage('es');
   }
 
  translateToEnglish(){
    this.translateService.use('en');
    //this.updateLanguage('en');
  }
  
  /*masterTranslate(lang: string){
    this.translateService.use(lang);
    this.updateLanguage(lang);
  }*/
}
