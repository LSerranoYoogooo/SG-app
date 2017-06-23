import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth-provider';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  uid: any;

  constructor(public navCtrl: NavController, public auth:AuthProvider, public translateService: TranslateService){}


  ngOnInit(){
    this.uid = this.auth.getCurrentUid();
  }

  logout() {
      this.auth.logout();
  }

  translateToSpanish(){
    this.translateService.use('es');
   }

  translateToEnglish(){
    this.translateService.use('en');
  }

}
