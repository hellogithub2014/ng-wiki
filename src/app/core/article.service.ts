import { BehaviorSubject, Observable, ReplaySubject, Subject } from 'rxjs/Rx';
import { Article, mockArticles } from './article';
import { Injectable } from '@angular/core';

import ulid from 'ulid';

@Injectable()
export class ArticleService {
  private articlesSubject: BehaviorSubject<Article[]> = new BehaviorSubject(mockArticles);
  private articles: Article[] = [];

  constructor() {
    this.articles = mockArticles;
  }

  createArticle(authorId: number, title: string, content: string): Article {
    return new Article(ulid(), authorId, title, content);
  }

  getAllArticles(): Observable<Article[]> {
    return this.articlesSubject.asObservable();
  }

  /**
   * 根据id获取文章
   *
   * @param {number} articleId
   * @returns {Observable<Article>}
   *
   * @memberof ArticleService
   */
  getArticleById(articleId: string): Observable<Article> {
    return this.getAllArticles()
      .switchMap(articles => Observable.from(articles))
      .find(article => article.id === articleId);
  }

  addArticles(...newArticles: Article[]) {
    this.articles = [...this.articles, ...newArticles];
    this.articlesSubject.next(this.articles);
  }
}
