import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { IbPage } from './ib';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    IbPage,
  ],
  imports: [
    IonicPageModule.forChild(IbPage),
    TranslateModule
  ],
  exports: [
    IbPage
  ]
})
export class IbPageModule {}
