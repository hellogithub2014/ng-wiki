import { ActivatedRoute, Router } from '@angular/router';
import { Article } from './../../core/article';
import { Input, ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css']
})
export class ArticleComponent implements OnInit {
  @Input() article: Article;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
  }

  /**
   * 点击每个文章概要跳转至文章详情
   *
   * @param {number} articleId  文章id
   *
   * @memberof ArticleListComponent
   */
  showDetail() {
    this.router.navigate(['../article-detail', this.article.id], { relativeTo: this.route });
  }
}
