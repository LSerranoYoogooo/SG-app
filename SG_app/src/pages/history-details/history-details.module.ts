import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HistoryDetailsPage } from './history-details';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    HistoryDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(HistoryDetailsPage),
    TranslateModule
  ],
  exports: [
    HistoryDetailsPage
  ]
})
export class HistoryDetailsPageModule {}
