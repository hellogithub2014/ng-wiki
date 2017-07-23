import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { JoinRoutingModule } from './join-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JoinComponent } from './join.component';

@NgModule({
  imports: [
    CommonModule,
    JoinRoutingModule,
    FormsModule,
    SharedModule,
  ],
  declarations: [JoinComponent]
})
export class JoinModule { }
