import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SignalDetailsPage } from './signal-details';
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  declarations: [
    SignalDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(SignalDetailsPage),
    TranslateModule,
  ],
  exports: [
    SignalDetailsPage
  ]
})
export class SignalDetailsPageModule {}
