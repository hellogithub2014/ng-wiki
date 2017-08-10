import { Component, OnInit, Input } from '@angular/core';
import * as moment from 'moment';

import { Article } from '../../core/article';
import { User } from './../../core/user';
import { LoginService } from './../../core/login.service';
import { Comment } from '../../core/models/comment.model';
import { CommentService } from './../../core/services/comment.service';

@Component({
  selector: 'comment-area',
  templateUrl: './comment-area.component.html',
  styleUrls: ['./comment-area.component.css']
})
export class CommentAreaComponent implements OnInit {
  @Input() article: Article;
  comments: Array<Comment>;
  commentContent: string;
  user: User;

  constructor(
    public commentService: CommentService,
    public loginService: LoginService,
  ) {
    this.commentContent = '';
  }

  ngOnInit() {
    this.getCommentList(this.article.id);
    this.loginService.loginUser.subscribe(user => this.user = user);
  }

  getCommentList(articleId: string) {
    this.commentService.getCommentList(articleId)
      .subscribe(
      data => this.comments = data['items'],
      error => console.error(error)
      );
  }


  /**
   * 给此文章添加评论，TODO：content和date有误
   *
   * @memberof CommentAreaComponent
   */
  addComment() {
    const comment: Comment = {
      id: Math.floor(Math.random() * (Math.pow(2, 53) - 1)),
      articleId: this.article.id,
      content: this.commentContent,
      date: moment().format('YYYY-MM-DD HH:mm:ss'),
      userId: this.user.id,
      userName: this.user.name,
      replyList: [],
    };

    this.commentService.addArticleComment(this.article, comment);
    this.comments = [...this.comments, comment];
    this.commentContent = '';
  }

  reply(comment: Comment) {
    const reply: Comment = {
      id: Math.floor(Math.random() * (Math.pow(2, 53) - 1)),
      articleId: this.article.id,
      content: "测试回复评论",
      date: moment().format('YYYY-MM-DD HH:mm:ss'),
      userId: this.user.id,
      userName: this.user.name,
      replyList: [],
    };

    comment.replyList = [...comment.replyList, reply.id];
  }
}
