import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { InitialPage } from './initial';
import { MainPipe } from "../../app/main-pipe.module";

@NgModule({
  declarations: [
    InitialPage,
  ],
  imports: [
    IonicPageModule.forChild(InitialPage),
    TranslateModule,
    MainPipe,
  ],
  exports: [
    InitialPage
  ]
})
export class InitialPageModule {}
