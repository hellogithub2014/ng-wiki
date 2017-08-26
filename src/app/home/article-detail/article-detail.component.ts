import { DomSanitizer } from '@angular/platform-browser';
import { Component, OnInit, SecurityContext } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Article } from 'app/core';
import { ArticleService } from '../../core/article.service';

@Component({
  selector: 'article-detail',
  templateUrl: './article-detail.component.html',
  styleUrls: ['./article-detail.component.css'],
})
export class ArticleDetailComponent implements OnInit {
  articleId: number;
  article: Article;
  articleContent = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private articleService: ArticleService,
    private sanitizer: DomSanitizer,
  ) { }

  ngOnInit() {
    this.route.params
      .map((params: Params) => this.articleId = +params['articleId'])
      .switchMap((articleId: number) => this.articleService.getArticleById(articleId))
      .subscribe(article => {
        this.article = article;
        this.articleContent = this.sanitizer.sanitize(
          SecurityContext.HTML,
          this.sanitizer.bypassSecurityTrustHtml(this.article.content)
        );
      });
  }

}
