import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ConfigurationPage } from './configuration';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    ConfigurationPage,
  ],
  imports: [
    IonicPageModule.forChild(ConfigurationPage),
    TranslateModule
  ],
  exports: [
    ConfigurationPage
  ]
})
export class ConfigurationPageModule {}
