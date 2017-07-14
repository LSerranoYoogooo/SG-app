import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VideosPage } from './videos';
import { TranslateModule } from '@ngx-translate/core';
import { MainPipe } from "../../app/main-pipe.module";

@NgModule({
  declarations: [
    VideosPage,
  ],
  imports: [
    IonicPageModule.forChild(VideosPage),
    TranslateModule,
    MainPipe,
  ],
  exports: [
    VideosPage
  ]
})
export class VideosPageModule {}
