import { NgModule } from '@angular/core';
import {CommonModule} from "@angular/common";
import { SafePipe } from "../pipes/safe/safe";

@NgModule({
  declarations:[SafePipe],
  imports:[CommonModule],
  exports:[SafePipe]
})

export class MainPipe{}
