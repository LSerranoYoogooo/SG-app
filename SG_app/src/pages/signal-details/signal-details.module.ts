import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SignalDetailsPage } from './signal-details';

@NgModule({
  declarations: [
    SignalDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(SignalDetailsPage),
  ],
  exports: [
    SignalDetailsPage
  ]
})
export class SignalDetailsPageModule {}
