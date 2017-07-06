import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VideosPage } from './videos';
import { SafePipe } from "../../pipes/safe/safe";

@NgModule({
  declarations: [
    VideosPage,
    SafePipe
  ],
  imports: [
    IonicPageModule.forChild(VideosPage),
    
  ],
  exports: [
    VideosPage
  ]
})
export class VideosPageModule {}
