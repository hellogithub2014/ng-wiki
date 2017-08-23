import { Component, OnInit, Input } from '@angular/core';

import { Article } from '../../core/article';
import { User } from './../../core/user';
import { LoginService } from './../../core/login.service';
import { Comment } from '../../core/models/comment.model';
import { CommentService } from './../../core/services/comment.service';
import { WriteCommentComponent } from './../write-comment/write-comment.component';

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

  getCommentList(articleId: number) {
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
    const comment: Comment = {
      id: -999,
      articleId: this.article.id,
      content: this.commentContent,
      userId: this.user.id,
      userName: this.user.name,
      date: '1970-01-01 00:00:00',
      replyList: [],
      to: -1
    };

    this.commentService.addArticleComment(comment)
      .subscribe(result => {
        if (result) {
          this.comments = [...this.comments, comment];
          this.commentContent = '';
        } else {
          console.error(`添加评论失败`);
        }
      },
      error => console.error(`添加评论失败`)
      );
  }

  reply(replyObj: { to: number, content: string }, commentIndex: number) {
    let comment = this.comments[commentIndex];

    const reply: Comment = {
      id: -999,
      articleId: this.article.id,
      content: replyObj.content,
      userId: this.user.id,
      userName: this.user.name,
      to: replyObj.to,
      replyList: [],
      date: '1970-01-01 00:00:00'
    };

    // 存储此回复到数据库
    // const storeComment$ = this.commentService.storeComment(reply)
    //   .map(replyId => Object.assign(reply, { id: replyId }));

    // // 将此回复加入文章的评论数组,这样就可以根据reply的id来查找回复
    // const addArticleCommentPromise = storeComment$
    //   .switchMap(storedReply => this.commentService.addArticleComment(this.article, storedReply))
    //   .toPromise();

    // // 将回复缓存起来
    // const addReply2CommentPromise = storeComment$
    //   .switchMap(storedReply => this.commentService.addReply2Comment(this.article.id, comment.id, storedReply.id))
    //   .toPromise();

    // // 等到两个都成功了再更新评论数组
    // Promise.all([addArticleCommentPromise, addReply2CommentPromise])
    //   .then(([result1, result2]) => {
    //     if (result1 && result2) {
    //       comment = Object.assign({}, comment); // 构造一个新对象，以让变更检测起作用
    //       this.comments = [
    //         ...this.comments.slice(0, commentIndex),
    //         comment,
    //         ...this.comments.slice(commentIndex + 1)
    //       ];
    //     }
    //   })
    //   .catch(error => console.error(`添加回复失败`, error));

    this.commentService.addReply2Comment(reply)
      .subscribe(result => {
        if (result) {
          comment = Object.assign({}, comment); // 构造一个新对象，以让变更检测起作用
          this.comments = [
            ...this.comments.slice(0, commentIndex),
            comment,
            ...this.comments.slice(commentIndex + 1)
          ];
        } else {
          console.error(`添加评论回复失败`);
        }
      },
      error => console.error(`添加评论回复失败`)
      );
  }
}
