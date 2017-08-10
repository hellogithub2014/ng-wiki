import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MdCardModule, MdListModule, MdIconModule, MdChipsModule } from '@angular/material';
import { ToastModule } from 'ng2-toastr/ng2-toastr';

import { HomeRoutingModule } from './home-routing.module';
import { SharedModule } from './../shared/shared.module';

import { HomeComponent } from './home.component';
import { ArticleDetailComponent } from './article-detail/article-detail.component';
import { ArticleComponent } from './article/article.component';
import { ArticleListComponent } from './article-list/article-list.component';
import { WriteArticleComponent } from './write-article/write-article.component';
import { CommentAreaComponent } from './comment-area/comment-area.component';

@NgModule({
  imports: [
    CommonModule,
    MdListModule,
    MdCardModule,
    MdIconModule,
    MdChipsModule,
    FormsModule,
    ToastModule.forRoot(),
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
    CommentAreaComponent,
  ],
  providers: []
})
export class HomeModule { }
