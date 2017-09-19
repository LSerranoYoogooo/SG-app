import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController, Events, LoadingController} from 'ionic-angular';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { AngularFireAuth } from 'angularfire2/auth';
import { FirebaseListObservable, AngularFireDatabase, FirebaseObjectObservable } from "angularfire2/database";
import { User } from '../../models/user';

@IonicPage()
@Component({
  selector: 'page-recover',
  templateUrl: 'recover.html',
})
export class RecoverPage {
  myForm: FormGroup;
  user = {} as User;

  constructor(public navCtrl: NavController, public navParams: NavParams, 
    public toast: ToastController, public alertCtrl: AlertController,
    private auth: AngularFireAuth, private db: AngularFireDatabase,
    public formBuilder: FormBuilder, public events: Events, public loadingCtrl: LoadingController) {
  
      this.myForm = this.createMyForm();
    }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RecoverPage');
  }

  private createMyForm(){
    return this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  private recover(user: User){
    this.reviewPreviusUsr(user.email).then(res=>{
      if(!res){
        this.toast.create({
          message: "Invalid Email",
          duration: 3000
        }).present();
      } else {
        this.auth.auth.createUserWithEmailAndPassword(user.email, user.password).then(resp=>{
          this.updateUser(res);
          this.navCtrl.setRoot('LoginPage');
        });
      }
    });
  }

  private reviewPreviusUsr(email: string){
    var result = false;
    return new Promise((resolve, reject) => {
      this.db.list('/users', {
        query: {
          indexOn: 'Email',
          orderByChild: 'Email',
          equalTo: email
        }
      }).subscribe(snapshot => {
        for (let user of snapshot){
          result = user.$key;
        }
        resolve(result);
      }).unsubscribe;
    });
  }

  updateUser(key: any){
    var item: FirebaseObjectObservable<any>;
    item = this.db.object('/users/' + key);
    item.update({State: "true"});
  }

}
