import { Article } from './../article';
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Observable } from 'rxjs/Rx';

import { Comment } from '../models/comment.model';

@Injectable()
export class CommentService {
  commentListURL = 'mock-data/comment-mock.json';
  commentsCahe: Map<string, Array<Comment>>;

  constructor(public http: Http) {
    this.commentsCahe = new Map();
  }

  getCommentList(articleId: string): Observable<Comment[]> {
    // 如果已经在缓存中了，那么直接从缓存中拿
    if (this.commentsCahe.has(articleId)) {
      return Observable.of(this.commentsCahe.get(articleId));
    }
    // 否则获取mock数据，然后放入缓存
    return this.http.get(this.commentListURL)
      .map((res: Response) => res.json()['items'])
      // 因为mock的评论数据的articleId都是写死的，为了根据不同的文章mock不同的评论，将所有评论的articleId设为传入的文章id
      .map(comments => comments.map(comment => Object.assign({}, comment, { articleId })))
      .do(comments => {
        this.commentsCahe.set(articleId, comments);
      });
  }

  addArticleComment(article: Article, comment: Comment) {
    article.comments = [...article.comments, comment];

    this.commentsCahe.get(article.id).push(comment); // 评论放入缓存
  }

  addReply2ArticleComment(articleId: string, commentId: number, replyId: number) {
    let comment = this.getCommentById(articleId, commentId);
    if (comment) {
      comment.replyList.push(replyId);
    }
  }

  /**
   * 根据id来查找评论，只在内存中查找，不发送后台请求
   * 所有已加载的文章，都会缓存放到内存中
   *
   * @param {string} articleId 文章id
   * @param {number} commentId 评论id
   * @returns 返回对应的评论， 如果找不到，返回undefined
   * @memberof CommentService
   */
  getCommentById(articleId: string, commentId: number) {
    const articleComments = this.commentsCahe.get(articleId);
    if (!articleComments) {
      return undefined;
    }

    return articleComments.find(comment => comment.id === commentId);
  }
}
