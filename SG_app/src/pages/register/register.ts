import { Component,/* NgZone*/ } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController, Events} from 'ionic-angular';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { User } from '../../models/user';
import { AngularFireAuth } from 'angularfire2/auth';
import { FirebaseListObservable, AngularFireDatabase, FirebaseObjectObservable } from "angularfire2/database";
import { Network } from "../../models/network";
import { Linea } from "../../models/line";

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {
  myForm: FormGroup;
  user = {} as User;
  network= {} as Network;
  users: FirebaseListObservable<any>;
  networkList: FirebaseListObservable<any>;
  ObjNet: FirebaseObjectObservable<any>
  myDate: string = new Date().toLocaleString();
  reference: string;
  reference2: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, 
    public toast: ToastController, public alertCtrl: AlertController,
    private auth: AngularFireAuth, private db: AngularFireDatabase,
    public formBuilder: FormBuilder, public events: Events) {
      this.myForm = this.createMyForm();
      this.users = db.list('/users');
      this.user.createDate = this.myDate;
     
    }

  private createMyForm(){
    return this.formBuilder.group({
      email: ['', Validators.required],
      name: ['', Validators.required],
      telephone: ['', Validators.required],
      password: ['', Validators.required],
      country: ['', Validators.required],
      code: ['', Validators.required],
    });
  }

  register(user: User) {    
    this.reviewReference(this.reference).then(res => {
      if(res){
        this.genReferCode();
        this.auth.auth.createUserWithEmailAndPassword(user.email, user.password).then(res=>{
          this.addUser(user);
          this.addToNetwork(user, this.reference).then(res =>{
            this.auxLine1(this.reference, user.email, user.referCode);
          });
        });
        } else{
        this.toast.create({
          message: 'Incorrect code',
          duration: 2000
          }).present();
          //this.navCtrl.pop();
      }
    }, error => {
      console.log(error);
    });
  }

  register_old(user: User){
    this.genReferCode();
        this.auth.auth.createUserWithEmailAndPassword(user.email, user.password).then(res=>{
          this.addUser(user);
          this.addToNetwork(user, this.reference).then(res =>{
            this.auxLine1(this.reference, user.email, user.referCode);
          });
        });
  }

  addUser(user: User){
    this.users.push({
      Email: user.email,
      Intro: '1',
      Name: user.name,
      Telephone: user.telephone,
      Country: user.country,
      Date: user.createDate,
      ReferCode: user.referCode,
      Sql: '0'
    });
  }

  genReferCode(){
    var unique = new Date().getTime();
    this.user.referCode = this.user.country + unique;
  }

  reviewReference(reference: string){
    var code;
    var res = false;
    return new Promise((resolve, reject) => {
      this.db.list('/users', {
        query: {
          indexOn: 'ReferCode',
          orderByChild: 'ReferCode',
          equalTo: reference
        }
      }).subscribe(snapshot => { 
        for (let user of snapshot){
          res = true;
        }
        resolve(res);
      }).unsubscribe;
    });
  }

  addToNetwork(user: User, reference: string){
    return new Promise((resolve, reject) => {
      var newUsr = {
        Reference: user.referCode,
        FatherReference: reference,
        Line1: [{ReferCode: "init", email: "init", state: "1"}],
        Line2: [{ReferCode: "init", email: "init", state: "1"}],
        Line3: [{ReferCode: "init", email: "init", state: "1"}],
        Line4: [{ReferCode: "init", email: "init", state: "1"}],
        Line5: [{ReferCode: "init", email: "init", state: "1"}],
      }
      this.db.list('/network').push(newUsr);
      resolve(true);
    });
    
  }

  auxLine1(codeReference: string, email: string, codeGenerate: string){
    var network: any;
    var line = {} as Linea;
    var key: any;
    line.Email = email;
    line.Reference = codeGenerate;
    line.State = "0";
    this.auxGetKey(codeReference).then(res =>{
      key = res;
      this.auxGetNetwork(codeReference).then( res => {
        network = res;
        var cant = network.Line1.length;
        if(cant <= 5){
          network.Line1.push(line);
          this.db.list('/network').remove(key);
          this.db.list('/network').push(network);
          this.auxLine2(network.FatherReference, line);
        } else{
          this.auxLine2(network.FatherReference, line);
        }
      })
    });
  }

  auxLine2(reference: string, line: Linea){
    var key: any;
    var network: any;
    console.log(reference);
    this.auxGetNetwork(reference).then(res => {
      network = res;
      if(network.Line2.length <= 25){
        network = res;
        network.Line2.push(line);
        this.auxGetKey(network.reference).then(res =>{
          key = res;
          this.db.list('/network').remove(key);
          this.db.list('/network').push(network);
          //this.auxLine3(network.FatherReference, line);
          });
      } else {
          //line3
      }
    });
  }

  auxLine3(reference: string, line: Linea){
    var key: any;
    var network: any;
    this.auxGetNetwork(reference).then(res => {
      network = res;
      if(network.FatherReference != 'Null'){
        if(network.Line2.length <= 125){
          this.auxGetNetwork(network.FatherReference).then(res => {
          network = res;
          network.Line3.push(line);
          this.auxGetKey(network.FatherReference).then(res =>{
            key = res;
            this.db.list('/network').remove(key);
            this.db.list('/network').push(network);
            //this.auxLine3(reference, line);
            });
          });
        } else {
          //line3
        }
      }
    });
  }

  auxGetKey(reference: string){
    var res: string;
    return new Promise((resolve, reject) => {
      this.db.list('/network', {
        query: {
          indexOn: 'Reference',
          orderByChild: 'Reference',
          equalTo: reference
        }
      }).subscribe(networkList => { 
        for (let userNet of networkList){
          res = userNet.$key;
          resolve(res);
        }
      }).unsubscribe;
    });
  }

  auxGetNetwork(reference){
    var network: Network;
    return new Promise((resolve, reject) => {
      this.db.list('/network', {
        query: {
          indexOn: 'Reference',
          orderByChild: 'Reference',
          equalTo: reference
        }
      }).subscribe(networkList => { 
        for (let userNet of networkList){
          network = userNet;
          resolve(network);
        }
      }).unsubscribe;
    });
  }
}
