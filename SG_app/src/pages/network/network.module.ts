import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NetworkPage } from './network';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    NetworkPage,
  ],
  imports: [
    IonicPageModule.forChild(NetworkPage),
    TranslateModule
  ],
  exports: [
    NetworkPage
  ]
})
export class NetworkPageModule {}
