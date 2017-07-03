import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SignalsPage } from './signals';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    SignalsPage,
  ],
  imports: [
    IonicPageModule.forChild(SignalsPage),
    TranslateModule
  ],
  exports: [
    SignalsPage
  ]
})
export class SignalsPageModule {}
