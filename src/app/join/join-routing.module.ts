import { JoinComponent } from './join.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const joinRoutes: Routes = [
  { path: '', component: JoinComponent},
  // { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(joinRoutes)
  ],
  exports: [
    RouterModule
  ],
})
export class JoinRoutingModule { }
