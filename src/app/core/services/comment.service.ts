import { Article } from './../article';
import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';

import { Observable } from 'rxjs/Rx';

import { Comment } from '../models/comment.model';

@Injectable()
export class CommentService {
  // commentListURL = 'mock-data/comment-mock.json';
  commentListURL = '/ngWikiBe/comments/comment-list';
  storeCommentUrl = '/ngWikiBe/comments/add-comment';
  addArticleCommentUrl = '/ngWikiBe/comments/add-article-comment';
  addCommentReplyUrl = '/ngWikiBe/comments/add-comment-reply';
  commentsCahe: Map<number, Array<Comment>>;

  constructor(public http: Http) {
    this.commentsCahe = new Map();
  }

  getCommentList(articleId: number): Observable<Comment[]> {
    // 如果已经在缓存中了，那么直接从缓存中拿
    if (this.commentsCahe.has(articleId)) {
      return Observable.of(this.commentsCahe.get(articleId));
    }
    // 否则获取mock数据，然后放入缓存
    return this.http.post(this.commentListURL,
      JSON.stringify({ articleId }), {
        headers: new Headers({ 'Content-Type': 'application/json' })
      })
      .map((res: Response) => res.json()['items'])
      // 因为mock的评论数据的articleId都是写死的，为了根据不同的文章mock不同的评论，将所有评论的articleId设为传入的文章id
      // .map(comments => comments.map(comment => Object.assign({}, comment, { articleId })))
      .do(comments => {
        this.commentsCahe.set(articleId, comments);
      });
  }

  /**
   * 添加文章评论，成功时流中产生true，失败发出false
   *
   * @param {Comment} comment
   * @returns {Observable<boolean>} 结果流
   * @memberof CommentService
   */
  addArticleComment(comment: Comment): Observable<boolean> {
    return this.http.post(this.addArticleCommentUrl,
      JSON.stringify(comment), {
        headers: new Headers({ 'Content-Type': 'application/json' })
      })
      .map(res => {
        const result: { commentId: number, commentDate: string; } = res.json();
        if (result) {
          comment.id = result.commentId;
          comment.date = result.commentDate;
          this.commentsCahe.get(comment.articleId).push(comment); // 评论放入缓存
          return true;
        }
        return false;
      });
  }


  /**
   * 回复文章评论，成功时流中产生true，失败发出false
   *
   * 所有的回复，不管是针对一级评论还是其他评论回复，都属于一级评论下的回复列表。
   * 每个回复的to字段可以判断他是具体回复谁的
   *
   * @param {Comment} comment
   * @returns {Observable<boolean>}  结果流
   * @memberof CommentService
   */
  addReply2Comment(comment: Comment): Observable<boolean> {
    // 找到此comment所属的一级评论，一级评论是指直接回复文章的评论
    let articleComment = comment;
    while (articleComment && articleComment.to !== -1) {
      articleComment = this.getCommentById(comment.articleId, articleComment.to);
    }

    if (!articleComment) { return Observable.of(false); }

    return this.http.post(this.addCommentReplyUrl, // 发送后台请求
      JSON.stringify({ comment, belong: articleComment.id }), { // belong表示此回复是属于哪个一级评论下的
        headers: new Headers({ 'Content-Type': 'application/json' })
      })
      .map(res => {
        const result: { commentId: number, commentDate: string; } = res.json(); // 后台返回结果，失败时为null
        if (result) {
          comment.id = result.commentId;
          comment.date = result.commentDate;
          this.commentsCahe.get(comment.articleId).push(comment); // 评论放入缓存
          articleComment.replyList.push(comment.id); // 存储评论的回复
          return true;
        }
        return false;
      });

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
  getCommentById(articleId: number, commentId: number) {
    const articleComments = this.commentsCahe.get(articleId);
    if (!articleComments) {
      return undefined;
    }

    return articleComments.find(comment => comment.id === commentId);
  }
}
