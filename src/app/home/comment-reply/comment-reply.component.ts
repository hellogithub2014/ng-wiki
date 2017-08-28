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
  selector: 'comment-reply',
  templateUrl: './comment-reply.component.html',
  styleUrls: ['./comment-reply.component.css']
})
export class CommentReplyComponent implements OnChanges {
  @Input() comment: Comment;
  @Input() canReply: boolean; // 是否能够回复
  @Output() addReply: EventEmitter<{ to: number, content: string }> = new EventEmitter();
  canReplyButtonDisplay: boolean; // 回复按钮是否可见

  constructor(
    public commentService: CommentService,
    public dialog: MdDialog,
  ) {
    this.canReplyButtonDisplay = false;
  }

  ngOnChanges(changes: SimpleChanges) {
    const newComment = changes['comment'].currentValue;
  }

  get userOfCommentTo() {
    const comment = this.commentService.getCommentById(this.comment.articleId, this.comment.to);
    if (comment) {
      return comment.userName;
    }
    return '无名氏';
  }


  /**
   * 回复评论
   *
   * @memberof CommentComponent
   */
  reply() {
    this.openCommentDialog((result) => {
      if (result.trim() !== '') {
        this.addReply.emit({ to: this.comment.id, content: result });
      }
    });
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
