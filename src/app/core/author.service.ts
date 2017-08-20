import { Http, Response } from '@angular/http';
import { ArticleService } from './article.service';
import { Author, mockAuthors } from './author';
import { Article, mockArticles } from './article';
import { BehaviorSubject, Observable, ReplaySubject, Subscription } from 'rxjs/Rx';

import 'rxjs/add/operator/first';

import { Injectable } from '@angular/core';

@Injectable()
export class AuthorService {
  private authorsSubject: BehaviorSubject<Author[]> = new BehaviorSubject(mockAuthors);
  private authors: Author[] = [];

  constructor(
    public http: Http,
    private articleService: ArticleService
  ) {
    // this.authors = mockAuthors;
    // this.mockSomeArticlesToAuthors();
  }

  getAllAuthors(): Observable<Author[]> {
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
    // const findedAuthor = this.authors.find(author => author.id === authorId);
    // if (findedAuthor) {
    //   return Observable.of(findedAuthor);
    // } else {
    //   return Observable.of(null);

    // }
    return this.http.get(`/ngWikiBe/users/author/${authorId}`)
      .map(res => res.json());
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

  addAuthor(newAuthor: Author) {
    this.authors = [...this.authors, newAuthor];
    this.authorsSubject.next(this.authors);
  }

  unshiftAuthor(newAuthor: Author) {
    this.authors = [newAuthor, ...this.authors];
    this.authorsSubject.next(this.authors);
  }

  shiftAuthor() {
    this.authors = this.authors.slice(1);
    this.authorsSubject.next(this.authors);
  }

  /**
   * mock数据
   *
   *
   * @memberof AuthorService
   */
  mockSomeArticlesToAuthors() {
    this.authors = this.authors.map((author, index) => {
      const articlesCountPerAuthor = mockArticles.length / this.authors.length; // 每个作者能分到的文章数
      const startIndex = index * articlesCountPerAuthor; // 分配给他的初始文章数索引

      for (let i = startIndex; i < startIndex + articlesCountPerAuthor; i++) {
        mockArticles[i].authorId = author.id; // 文章分配作者
        author.articles = [...author.articles, mockArticles[i].id]; // 作者分配文章
      }

      return author;
    });

    this.authorsSubject.next(this.authors);
  }
}
