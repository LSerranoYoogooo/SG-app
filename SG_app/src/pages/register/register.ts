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
  //network= {} as Network;
  users: FirebaseListObservable<any>;
  //networkList: FirebaseListObservable<any>;
  //ObjNet: FirebaseObjectObservable<any>
  myDate: string = new Date().toLocaleString();
  reference: string;
  //reference2: string;

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
      var cant = res;
      if(res){
        this.genReferCode();
        this.auth.auth.createUserWithEmailAndPassword(user.email, user.password).then(res=>{
          this.addUser(user);
          if(cant <= 5){
            console.log("nueva hoja --> " + user.email);
            this.addToNetwork(user, this.reference).then(res =>{
              this.auxLine1(this.reference, user.email, user.referCode);
            });
          } else{
            this.addToNetwork(user, "Null").then(res =>{
              //this.auxLine1(this.reference, user.email, user.referCode);
            });
          }
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

  addUser(user: User){
    this.users.push({
      Email: user.email,
      Intro: '1',
      Name: user.name,
      Telephone: user.telephone,
      Country: user.country,
      Date: user.createDate,
      ReferCode: user.referCode
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
          console.log("line1");
          network.Line1.push(line);
          this.db.list('/network').remove(key);
          this.db.list('/network').push(network);
          if(network.FatherReference != 'Null'){
            this.auxLine2(network.FatherReference, line);
          }
        }
      })
    });
  }

  auxLine2(fatherReference: string, line: Linea){
    var key: any;
    var network: any;
    this.auxGetNetwork(fatherReference).then(res => {
      network = res;
      if(network.Line2.length <= 25){
        console.log("line2");
        network.Line2.push(line);
        this.auxGetKey(network.reference).then(res =>{
          key = res;
          this.db.list('/network').remove(key);
          this.db.list('/network').push(network);
          if(network.FatherReference != 'Null'){
            console.log(network.FatherReference);
            this.auxLine3(network.FatherReference, line);
          }
        });
      }
    });
  }

  auxLine3(fatherReference: string, line: Linea){
    var key: any;
    var network: any;
    this.auxGetNetwork(fatherReference).then(res => {
      network = res;
      console.log(network);
      if(network.Line3.length <= 125){
        console.log("line3");
        network.Line2.push(line);
        this.auxGetKey(network.reference).then(res =>{
          key = res;
          console.log(key);
          this.db.list('/network').remove(key);
          this.db.list('/network').push(network);
          if(network.FatherReference != 'Null'){
            this.auxLine4(network.FatherReference, line);
          }
        });
      }
    });
  }

  auxLine4(fatherReference: string, line: Linea){
    var key: any;
    var network: any;
    this.auxGetNetwork(fatherReference).then(res => {
      network = res;
      if(network.Line2.length <= 625){
        console.log("line4");
        network.Line2.push(line);
        this.auxGetKey(network.reference).then(res =>{
          key = res;
          this.db.list('/network').remove(key);
          this.db.list('/network').push(network);
          if(network.FatherReference != 'Null'){
            this.auxLine5(network.FatherReference, line);
          }
        });
      }
    });
  }

  auxLine5(fatherReference: string, line: Linea){
    var key: any;
    var network: any;
    this.auxGetNetwork(fatherReference).then(res => {
      network = res;
      if(network.Line2.length <= 3125){
        console.log("line5");
        network.Line2.push(line);
        this.auxGetKey(network.reference).then(res =>{
          key = res;
          this.db.list('/network').remove(key);
          this.db.list('/network').push(network);
        });
      }
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
}
