import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home.component';
import { ArticleListComponent } from './article-list/article-list.component';
import { ArticleDetailComponent } from './article-detail/article-detail.component';
import { WriteArticleComponent } from './write-article/write-article.component';

import { CanDeactivateGuard } from './write-article/can-deactive-guard.service';

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
        canDeactivate: [CanDeactivateGuard],
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
  providers: [CanDeactivateGuard],
})
export class HomeRoutingModule { }
