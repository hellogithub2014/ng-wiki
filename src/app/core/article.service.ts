import { Http, Headers } from '@angular/http';
import { BehaviorSubject, Observable, ReplaySubject, Subject } from 'rxjs/Rx';
import { Article, mockArticles } from './article';
import { Injectable } from '@angular/core';

import ulid from 'ulid';

@Injectable()
export class ArticleService {
  private articlesSubject: BehaviorSubject<Article[]> = new BehaviorSubject(mockArticles);
  private articles: Article[] = [];

  constructor(
    private http: Http,
  ) {
    // this.articles = mockArticles;
  }

  /**
   * 创建新文章
   *
   * @param {number} authorId
   * @param {string} title
   * @param {string} content
   * @returns {Observable<Article>}
   * @memberof ArticleService
   */
  createArticle(authorId: number, title: string, content: string): Observable<Article> {
    return this.http.post('/ngWikiBe/articles/create-article',
      JSON.stringify({ authorId, title, content }), {
        headers: new Headers({ 'Content-Type': 'application/json' })
      })
      .map(res => {
        const article = new Article(res.json(), authorId, title, content);
        this.articles.push(article);
        return article;
      });

    // return new Article(ulid(), authorId, title, content);
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
    // return this.getAllArticles()
    //   .switchMap(articles => Observable.from(articles))
    //   .find(article => article.id === articleId);
    // 先从缓存中查找，找不到时再去数据库查
    const findedArticle = this.articles.find(article => article.id === articleId);
    if (findedArticle) {
      return Observable.of(findedArticle);
    } else {
      return this.http.get(`/ngWikiBe/articles/article/${articleId}`)
        .map(res => res.json());
    }
  }


  /**
   * 根据文章id列表批量获取文章，TODO: 根据先看缓存中有没有，没有再去数据库查询
   *
   * @param {string[]} articleIdList
   * @returns {Observable<Article[]>}
   * @memberof ArticleService
   */
  getArticleListById(articleIdList: string[]): Observable<Article[]> {
    return this.http.post('/ngWikiBe/articles/articles',
      JSON.stringify({ idList: articleIdList.join(',') }), {
        headers: new Headers({ 'Content-Type': 'application/json' })
      })
      .map(res => res.json());
  }

  addArticles(...newArticles: Article[]) {
    this.articles = [...this.articles, ...newArticles];
    this.articlesSubject.next(this.articles);
  }
}
