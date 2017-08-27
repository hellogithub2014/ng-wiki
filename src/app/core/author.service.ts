import { DataService } from './services/data.service';
import { Http, Response } from '@angular/http';
import { ArticleService } from './article.service';
import { Author } from './author';
import { Article } from './article';
import { BehaviorSubject, Observable, ReplaySubject, Subscription } from 'rxjs/Rx';

import { Injectable } from '@angular/core';

@Injectable()
export class AuthorService {
  private addAuthorUrl = '/ngWikiBe/users/add-author';
  private authorsSubject: BehaviorSubject<Author[]> = new BehaviorSubject([]);
  private authors: Author[] = [];

  constructor(
    public http: Http,
    private articleService: ArticleService,
    private dataService: DataService,
  ) { }

  getAllAuthors(): Observable<Author[]> {
    // 先看缓存中有没有数据
    if (this.authors.length > 0) {
      return Observable.of(this.authors);
    }
    // 没有再去后台查询
    return this.http.get('/ngWikiBe/users/author-list')
      .map((res: Response) => res.json())
      .do(items => {
        this.authors = items;
        this.authorsSubject.next(this.authors);
      });
  }

  /**
   * 根据id获取作者
   *
   * @param {number} authorId
   *
   * @memberof AuthorService
   */
  getAuthorById(authorId: number): Observable<Author> {
    // 先从缓存中查找，找不到时再去数据库查
    const findedAuthor = this.authors.find(author => author.id === authorId);
    if (findedAuthor) {
      return Observable.of(findedAuthor);
    } else {
      return this.http.get(`/ngWikiBe/users/author/${authorId}`)
        .map(res => res.json());
    }
  }


  /**
   * 将一篇文章添加给指定作者
   *
   * @param {Article} article
   * @param {Author} author
   *
   * @memberof AuthorService
   */
  addArticleToAuthor(article: Article, author: Author) {
    this.authors = this.authors.map(_author => {
      if (_author.id === author.id) {
        return Object.assign({}, _author, { articles: [..._author.articles, article.id] });
      } else {
        return _author;
      }
    });

    this.authorsSubject.next(this.authors);
  }

  /**
   * 注册成为新用户
   *
   * @param {{
   *     name: string,
   *     ystNumber: string,
   *     department: string,
   *     speciality: string,
   *     hobby: string,
   *   }} authorInfo
   * @returns {Observable<boolean>}  注册是否成功
   * @memberof AuthorService
   */
  addAuthor(authorInfo: {
    name: string,
    ystNumber: string,
    department: string,
    speciality: string,
    hobby: string,
  }): Observable<Author> {
    return this.dataService.postData(this.addAuthorUrl, authorInfo)
      .map((authorId: number) => {
        const newAuthor: Author = Object.assign({}, authorInfo, { id: authorId, articles: [] });
        // 在登录后才将其加入authors中
        // this.authors = [...this.authors, newAuthor];
        // this.authorsSubject.next(this.authors);
        return newAuthor;
      });
  }

  unshiftAuthor(newAuthor: Author) {
    this.authors = [newAuthor, ...this.authors];
    this.authorsSubject.next(this.authors);
  }

  shiftAuthor() {
    this.authors = this.authors.slice(1);
    this.authorsSubject.next(this.authors);
  }

}
