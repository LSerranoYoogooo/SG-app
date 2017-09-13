import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RecoverPage } from './recover';

@NgModule({
  declarations: [
    RecoverPage,
  ],
  imports: [
    IonicPageModule.forChild(RecoverPage),
  ],
  exports: [
    RecoverPage
  ]
})
export class RecoverPageModule {}
