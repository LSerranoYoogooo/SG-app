import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { IbPage } from './ib';

@NgModule({
  declarations: [
    IbPage,
  ],
  imports: [
    IonicPageModule.forChild(IbPage),
  ],
  exports: [
    IbPage
  ]
})
export class IbPageModule {}
