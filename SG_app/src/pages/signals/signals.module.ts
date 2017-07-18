import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SignalsPage } from './signals';
import { TranslateModule } from '@ngx-translate/core';
import { SignalDetailsPageModule } from "../signal-details/signal-details.module";
import { HistoryDetailsPageModule } from "../history-details/history-details.module";

@NgModule({
  declarations: [
    SignalsPage,
  ],
  imports: [
    IonicPageModule.forChild(SignalsPage),
    TranslateModule,
    SignalDetailsPageModule,
    HistoryDetailsPageModule
  ],
  exports: [
    SignalsPage,
  ]
})
export class SignalsPageModule {}
