import { AboutComponent } from './about.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const aboutRoutes: Routes = [
  { path: '', component: AboutComponent},
  // { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(aboutRoutes)
  ],
  exports: [
    RouterModule
  ],
})
export class AboutRoutingModule { }
