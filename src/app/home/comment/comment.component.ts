import { SimpleChanges, Component, OnChanges, OnInit, Input } from '@angular/core';

import { CommentService } from './../../core/services/comment.service';
import { Comment } from '../../core/models/comment.model';

@Component({
  selector: 'comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit, OnChanges {
  @Input() comment: Comment;
  relpyList: Comment[];


  constructor(
    public commentService: CommentService,
  ) {
    this.relpyList = [];
  }

  public ngOnInit(): void {
    this.relpyList = this.getRelpyList(this.comment);
  }

  ngOnChanges(changes: SimpleChanges) {
    const newComment = changes['comment'].currentValue;
    this.relpyList = this.getRelpyList(newComment);
  }

  /**
   * 获取此评论对应的回复列表
   *
   * @memberof CommentComponent
   */
  getRelpyList(comment: Comment) {
    if (!comment) {
      return [];
    };
    return comment.replyList
      .map(replyId => this.commentService.getCommentById(comment.articleId, replyId))
      .filter(reply => reply); // 过滤掉undefined
  }

  get userOfCommentTo() {
    const comment = this.commentService.getCommentById(this.comment.articleId, this.comment.to);
    if (comment) {
      return comment.userName;
    }
    return '无名氏';
  }
}
