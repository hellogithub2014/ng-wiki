import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { MdDialog } from '@angular/material';

import { CommentService } from './../../core/services/comment.service';
import { Comment } from '../../core/models/comment.model';
import { WriteCommentComponent } from './../write-comment/write-comment.component';

@Component({
  selector: 'comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit, OnChanges {
  @Input() comment: Comment;
  @Input() canReply: boolean; // 是否能够回复
  @Output() addReply: EventEmitter<{ to: number, content: string }> = new EventEmitter();
  relpyList: Comment[];
  canReplyButtonDisplay: boolean; // 回复按钮是否可见

  constructor(
    public commentService: CommentService,
    public dialog: MdDialog,
  ) {
    this.relpyList = [];
    this.canReplyButtonDisplay = false;
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


  /**
   * 回复。  可以是回复的一级评论，也可以是回复的其他的回复
   *
   * @memberof CommentComponent
   */
  reply(to: number, replyObj: { to: number, content: string }) {
    // 若replyObj有值，则表示是回复的其他回复，可以直接将事件冒泡
    if (replyObj) {
      this.addReply.emit({ to, content: replyObj.content });
    } else {
      // 否则表示回复的是一级评论，需要打开弹窗输入内容
      this.openCommentDialog((result) => {
        if (result.trim() !== '') {
          this.addReply.emit({ to, content: result });
        }
      });
    }
  }

  openCommentDialog(resultCallback: (result: string) => void) {
    const dialogRef = this.dialog.open(WriteCommentComponent, {
      data: { commentContent: this.comment.content },
      width: '300px',
      height: '300px',
    });
    dialogRef.afterClosed().subscribe(result => {
      resultCallback(result);
    });
  }


  displayReplyButton() {
    this.canReplyButtonDisplay = true;
  }
  hideReplyButton() {
    this.canReplyButtonDisplay = false;
  }
}
