import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MdCardModule, MdListModule, MdIconModule } from '@angular/material';


import { HomeRoutingModule } from './home-routing.module';
import { SharedModule } from './../shared/shared.module';

import { HomeComponent } from './home.component';
import { ArticleDetailComponent } from './article-detail/article-detail.component';
import { ArticleComponent } from './article/article.component';
import { ArticleListComponent } from './article-list/article-list.component';
import { WriteArticleComponent } from './write-article/write-article.component';

@NgModule({
  imports: [
    CommonModule,
    MdListModule,
    MdCardModule,
    MdIconModule,
    SharedModule,
    HomeRoutingModule
  ],
  exports: [HomeComponent],
  declarations: [
    HomeComponent,
    ArticleListComponent,
    ArticleComponent,
    ArticleDetailComponent,
    WriteArticleComponent,
  ],
  providers: []
})
export class HomeModule { }
