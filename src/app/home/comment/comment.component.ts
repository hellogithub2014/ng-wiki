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
   * 回复此评论,这里采用了“组件递归”的方法来处理文章评论以及评论的回复。
   * 在处理事件时，通过断点调试发现事件对象的类型入函数参数所示
   *
   * @memberof CommentComponent
   */
  reply(to: number, replyObj: { to: number, content: string }) {
    // TODO：使用PrimeNG和ANgular material两种弹窗+表单添加真实评论
    if (replyObj) {
      this.addReply.emit({ to, content: replyObj.content });
    } else {
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
