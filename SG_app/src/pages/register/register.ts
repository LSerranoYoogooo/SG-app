import { Component} from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController, Events, LoadingController} from 'ionic-angular';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { User } from '../../models/user';
import { AngularFireAuth } from 'angularfire2/auth';
import { FirebaseListObservable, AngularFireDatabase } from "angularfire2/database";
import { Network } from "../../models/network";
import { Linea } from "../../models/line";
import { LoginPage } from "../login/login";

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {
  myForm: FormGroup;
  user = {} as User;
  users: FirebaseListObservable<any>;
  myDate: string = new Date().toLocaleString();
  reference: string;
  countries: {};

  constructor(public navCtrl: NavController, public navParams: NavParams, 
    public toast: ToastController, public alertCtrl: AlertController,
    private auth: AngularFireAuth, private db: AngularFireDatabase,
    public formBuilder: FormBuilder, public events: Events, public loadingCtrl: LoadingController) {
      this.myForm = this.createMyForm();
      this.users = db.list('/users');
      this.user.createDate = this.myDate;
      this.countries = [
        {Sigla: 'CAN', Country: 'Canadá'}, 
        {Sigla: 'USA', Country: 'United States'}, 
        {Sigla: 'MEX', Country: 'México'},  
        {Sigla: 'GTM', Country: 'Guatemala'}, 
        {Sigla: 'BLZ', Country: 'Belice'}, 
        {Sigla: 'SLV', Country: 'El Salvador'},
        {Sigla: 'HDN', Country: 'Honduras'},
        {Sigla: 'NIC', Country: 'Nicaragua'},
        {Sigla: 'CRI', Country: 'Costa Rica'},
        {Sigla: 'PAN', Country: 'Panamá'},
        {Sigla: 'COL', Country: 'Colombia'},
        {Sigla: 'VEN', Country: 'Venezuela'},
        {Sigla: 'ECU', Country: 'Ecuador'},
        {Sigla: 'PER', Country: 'Peru'},
        {Sigla: 'BRA', Country: 'Brasil'},
        {Sigla: 'BOL', Country: 'Bolivia'},
        {Sigla: 'CHL', Country: 'Chile'},
        {Sigla: 'PRY', Country: 'Paraguay'},
        {Sigla: 'ARG', Country: 'Argentina'},
        {Sigla: 'URY', Country: 'Uruguay'},
        {Sigla: 'TTO', Country: 'Trinidad y Tobago'},
        {Sigla: 'DOM', Country: 'Republica Dominicana'}];     
    }

    presentLoading() {
      this.loadingCtrl.create({
        content: 'Please wait...',
        duration: 4000,
        dismissOnPageChange: true
      }).present();
    }

  private createMyForm(){
    return this.formBuilder.group({
      email: ['', Validators.required],
      name: ['', Validators.required],
      telephone: ['', Validators.required],
      password: ['', Validators.required],
      country: ['', Validators.required],
      code: ['', Validators.required],
      product: ['', Validators.required]
    });
  }

  register(user: User) {
    this.presentLoading();
    try{
      this.reviewReference(this.reference).then(res => {
        var cant = res;
        if(res){
          this.genReferCode(user.product);
          this.auth.auth.createUserWithEmailAndPassword(user.email, user.password).then(res=>{
            this.addUser(user);
            this.addToNetwork(user, this.reference).then(res =>{
              this.auxLine1(this.reference, user.email, user.referCode, user.name);
            });
          });
          this.navCtrl.pop();
        } else{
          this.toast.create({
            message: 'Incorrect code',
            duration: 2000
            }).present();
          this.navCtrl.pop();
        }
      });
    } catch(e){
      //this.loadingCtrl.dimiss;
      if(e.code == "auth/argument-error"){
        this.toast.create({
          message: "Indicate email and password",
          duration: 2000
        }).present();
      } else if (e.code == "auth/weak-password"){
        this.toast.create({
          message: "Password 6 characters long or more",
          duration: 2000
        }).present();
      } else if (e.code == "auth/invalid-email"){
        this.toast.create({
          message: "Invalid Email",
          duration: 2000
        }).present();
      } else if (e.code == "auth/email-already-in-use"){
        this.toast.create({
          message: "Email is already in use",
          duration: 2000
        }).present();
      } else {
        this.toast.create({
          message: "Error",
          duration: 1000
        }).present();
      }
    }
  }

  addUser(user: User){
    this.users.push({
      Email: user.email,
      Intro: 'true',
      Name: user.name,
      Telephone: user.telephone,
      Country: user.country,
      Date: user.createDate,
      ReferCode: user.referCode,
      Product: user.product,
      State: "true"
    });
  }

  genReferCode(product: string){
    var unique = new Date().getTime();
    if(product == 'admin'){
      this.user.referCode = this.user.country + unique + '-1';
    } else{
      this.user.referCode = this.user.country + unique + '-2';
    }
  }

  reviewReference(reference: string){
    var res = false;
    return new Promise((resolve, reject) => {
      this.db.list('/network', {
        query: {
          indexOn: 'Reference',
          orderByChild: 'Reference',
          equalTo: reference
        }
      }).subscribe(Network => { 
        for (let userNet of Network){
          res = userNet.Line1.length;
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

  auxLine1(codeReference: string, email: string, codeGenerate: string, name: string){
    var network1: any;
    var line = {} as Linea;
    var key1: any;
    line.Email = email;
    line.Reference = codeGenerate;
    line.State = "0";
    line.Name = name;
    this.auxGetKey(codeReference).then(res =>{
      key1 = res;
      this.auxGetNetwork(codeReference).then( res => {
        network1 = res;
        network1.Line1.push(line);
        this.db.list('/network').update(key1, network1);
        if(network1.FatherReference != 'Null'){
          this.auxLine2(network1.FatherReference, line);
        }
      })
    });
  }

  auxLine2(fatherReference: string, line: Linea){
    var key2: any;
    var network2: any;
    this.auxGetNetwork(fatherReference).then(res => {
      network2 = res;
      network2.Line2.push(line);
      this.auxGetKey(fatherReference).then(res =>{
        key2 = res;
        this.db.list('/network').update(key2, network2);
        if(network2.FatherReference != 'Null'){
          this.auxLine3(network2.FatherReference, line);
        }
      });
    });
  }

  auxLine3(fatherReference: string, line: Linea){
    var key3: any;
    var network3: any;
    this.auxGetNetwork(fatherReference).then(res => {
      network3 = res;
      network3.Line3.push(line);
      this.auxGetKey(fatherReference).then(res =>{
        key3 = res;
        this.db.list('/network').update(key3, network3);
        if(network3.FatherReference != 'Null'){
          this.auxLine4(network3.FatherReference, line);
        }
      });
    });
  }

  auxLine4(fatherReference: string, line: Linea){
    var key4: any;
    var network4: any;
    this.auxGetNetwork(fatherReference).then(res => {
      network4 = res;
      network4.Line4.push(line);
      this.auxGetKey(fatherReference).then(res =>{
        key4 = res;
        this.db.list('/network').update(key4, network4);
        if(network4.FatherReference != 'Null'){
          this.auxLine5(network4.FatherReference, line);
        }
      });
    });
  }

  auxLine5(fatherReference: string, line: Linea){
    var key5: any;
    var network5: any;
    this.auxGetNetwork(fatherReference).then(res => {
      network5 = res;
      network5.Line5.push(line);
      this.auxGetKey(fatherReference).then(res =>{
      key5 = res;
      this.db.list('/network').update(key5, network5);
      });
    });
  }

}
