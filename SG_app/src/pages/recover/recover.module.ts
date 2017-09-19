import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RecoverPage } from './recover';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    RecoverPage,
  ],
  imports: [
    IonicPageModule.forChild(RecoverPage),
    TranslateModule
  ],
  exports: [
    RecoverPage
  ]
})
export class RecoverPageModule {}
