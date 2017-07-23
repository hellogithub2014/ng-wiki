import { SharedModule } from './../shared/shared.module';
import { WriteArticleComponent } from './write-article/write-article.component';
import { ArticleListComponent } from './article-list/article-list.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { RouterModule, Routes } from '@angular/router';
import { ArticleComponent } from './article/article.component';
import { MdCardModule, MdListModule } from '@angular/material';
import { ArticleDetailComponent } from './article-detail/article-detail.component';


const homeRoutes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: 'article-list',
        component: ArticleListComponent,
      },
      {
        path: 'article-detail/:articleId',
        component: ArticleDetailComponent,
      },
      {
        path: '',
        redirectTo: './article-list',
        pathMatch: 'full'
      },
      // { path: '**', component: HomeComponent }
    ]
  },
];

@NgModule({
  imports: [
    CommonModule,
    MdListModule,
    MdCardModule,
    RouterModule.forChild(homeRoutes),
    SharedModule,
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
