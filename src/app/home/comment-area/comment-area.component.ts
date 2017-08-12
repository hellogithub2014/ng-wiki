import { Component, OnInit, Input } from '@angular/core';

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
      commentList => {
        this.comments = commentList.filter(comment => comment.to === -1); // 只获取直接评论文章的那些评论
      },
      error => console.error(error)
      );
  }


  /**
   * 给此文章添加评论
   *
   * @memberof CommentAreaComponent
   */
  addComment() {
    const comment: Comment = new Comment({
      articleId: this.article.id,
      content: this.commentContent,
      userId: this.user.id,
      userName: this.user.name,
    });

    this.commentService.addArticleComment(this.article, comment);
    this.comments = [...this.comments, comment];
    this.commentContent = '';
  }

  reply(replyObj: { to: number, content: string }, commentIndex: number) {
    let comment = this.comments[commentIndex];

    const reply: Comment = new Comment({
      articleId: this.article.id,
      content: replyObj.content,
      userId: this.user.id,
      userName: this.user.name,
      // to: comment.id,
      to: replyObj.to,
    });

    this.commentService.addArticleComment(this.article, reply); // 将此回复加入文章的评论数组,这样就可以根据reply的id来查找回复
    this.commentService.addReply2ArticleComment(this.article.id, comment.id, reply.id); // 将回复缓存起来
    comment = Object.assign({}, comment); // 构造一个新对象，以让变更检测起作用
    this.comments = [
      ...this.comments.slice(0, commentIndex),
      comment,
      ...this.comments.slice(commentIndex + 1)
    ];
  }
}
