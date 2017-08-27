import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { JoinRoutingModule } from './join-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JoinComponent } from './join.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    NgbModule,
    CommonModule,
    JoinRoutingModule,
    FormsModule,
    SharedModule,
  ],
  declarations: [JoinComponent]
})
export class JoinModule { }
