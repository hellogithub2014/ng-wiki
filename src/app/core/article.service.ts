import { Http, Headers } from '@angular/http';
import { BehaviorSubject, Observable, ReplaySubject, Subject } from 'rxjs/Rx';
import { Article, mockArticles } from './article';
import { Injectable } from '@angular/core';


@Injectable()
export class ArticleService {
  private addArticleVisitCountUrl = '/ngWikiBe/articles/add-article-visit-count';
  private toggleArticleLikesFlagUrl = '/ngWikiBe/articles/toggle-article-likes-flag';
  private addArticleSharedCountUrl = '/ngWikiBe/articles/add-article-shared-count';
  private getArticleLikesFlagUrl = '/ngWikiBe/articles/get-article-likes-flag';

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
  getArticleById(articleId: number): Observable<Article> {
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
  getArticleListById(articleIdList: number[]): Observable<Article[]> {
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


  /**
   * 为文章阅读量加1
   *
   * @param {number} articleId 文章id
   * @returns {Observable<boolean>} 后台操作结果，成功返回true，失败返回false
   * @memberof ArticleService
   */
  addArticleVisitCount(articleId: number): Observable<boolean> {
    return this.http.post(this.addArticleVisitCountUrl,
      JSON.stringify({ articleId }), {
        headers: new Headers({ 'Content-Type': 'application/json' })
      })
      .map(res => res.json());
  }

  /**
   * 切换文章点赞，若之前点过赞，则取消点赞
   * TODO: 当前是由前端将userId传到后端，后续从后端获取userId
   *
   * @param {number} articleId 文章id
   * @param {number} userId 作者id
   * @returns {Observable<boolean>} 后台操作结果，成功返回true，失败返回false
   * @memberof ArticleService
   */
  toggleArticleLikesCount(articleId: number, userId: number): Observable<boolean> {
    return this.http.post(this.toggleArticleLikesFlagUrl,
      JSON.stringify({ articleId, userId }), {
        headers: new Headers({ 'Content-Type': 'application/json' })
      })
      .map(res => res.json());
  }

  /**
   * 获取用户是否给文章点过赞
   *
   * @param {number} articleId
   * @param {number} userId
   * @returns {Observable<boolean>} 点过赞，发射true。未点过发射false
   * @memberof ArticleService
   */
  getArticleLikesFlag(articleId: number, userId: number): Observable<boolean> {
    return this.http.post(this.getArticleLikesFlagUrl,
      JSON.stringify({ articleId, userId }), {
        headers: new Headers({ 'Content-Type': 'application/json' })
      })
      .map(res => res.json());
  }

  /**
   * 为文章分享量加1
   *
   * @param {number} articleId 文章id
   * @returns {Observable<boolean>} 后台操作结果，成功返回true，失败返回false
   * @memberof ArticleService
   */
  addArticleSharedCount(articleId: number): Observable<boolean> {
    return this.http.post(this.addArticleSharedCountUrl,
      JSON.stringify({ articleId }), {
        headers: new Headers({ 'Content-Type': 'application/json' })
      })
      .map(res => res.json());
  }
}
