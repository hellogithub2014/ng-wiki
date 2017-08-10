import { Article } from '../../core/article';
import { User } from './../../core/user';
import { LoginService } from './../../core/login.service';
import { Comment } from '../../core/models/comment.model';
import { CommentService } from './../../core/services/comment.service';
import { Component, OnInit, Input } from '@angular/core';

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
    const comment = new Comment();
    comment.id = Math.floor(Math.random() * (Math.pow(2, 53) - 1));
    comment.articleId = this.article.id;
    comment.content = this.commentContent;
    comment.date = '' + new Date();
    comment.userId = this.user.id;
    this.commentService.addArticleComment(this.article, comment);
    this.comments = [...this.comments, comment];
    this.commentContent = '';
  }
}
