import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'page-config',
  templateUrl: 'config.html'
})
export class ConfigPage {

  constructor(
    public navCtrl:   NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public translateService: TranslateService
  ) {}

  ionViewDidLoad() {
  }

  enviar(){
    let alert = this.alertCtrl.create({
      title:    'Contacto',
      subTitle: 'Su peticion ha sido enviada exitosamente!',
      buttons:  ['OK']
    });
    alert.present();
  }

  translateToSpanish(){
    this.translateService.use('es');
  }

  translateToEnglish(){
    this.translateService.use('en');
  }

}
  

