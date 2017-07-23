import { Article } from 'app/core';
import { ArticleService } from '../../core/article.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'article-detail',
  templateUrl: './article-detail.component.html',
  styleUrls: ['./article-detail.component.css']
})
export class ArticleDetailComponent implements OnInit {
  articleId: number;
  article: Article;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private articleService: ArticleService,
  ) { }

  ngOnInit() {
    this.route.params
      .map((params: Params) => this.articleId = params['articleId'])
      .switchMap((articleId: string) => this.articleService.getArticleById(articleId))
      .subscribe(article => this.article = article);
  }

}
