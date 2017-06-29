import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'page-config',
  templateUrl: 'config.html'
})
export class ConfigPage {

  constructor(public navCtrl:   NavController, public navParams: NavParams, public translateService: TranslateService) {

  }
  
  translateToSpanish(){
    this.translateService.use('es');
  }

  translateToEnglish(){
    this.translateService.use('en');
  }

}
  

