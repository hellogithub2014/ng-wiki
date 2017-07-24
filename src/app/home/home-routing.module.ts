import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home.component';
import { ArticleListComponent } from './article-list/article-list.component';
import { ArticleDetailComponent } from './article-detail/article-detail.component';
import { WriteArticleComponent } from './write-article/write-article.component';


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
        path: 'write-article/:authorId',
        component: WriteArticleComponent,
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
    RouterModule.forChild(homeRoutes)
  ],
  exports: [
    RouterModule
  ],
})
export class HomeRoutingModule { }
