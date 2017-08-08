import { Comment } from '../../core/models/comment.model';
import { CommentService } from './../../core/services/comment.service';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'comment-area',
  templateUrl: './comment-area.component.html',
  styleUrls: ['./comment-area.component.css']
})
export class CommentAreaComponent implements OnInit {
  @Input() articleId: string;
  public comments: Array<Comment>;

  constructor(public commentService: CommentService) { }

  ngOnInit() {
    this.getCommentList(this.articleId);
  }

  public getCommentList(articleId: string) {
    this.commentService.getCommentList(articleId)
      .subscribe(
      data => this.comments = data['items'],
      error => console.error(error)
      );
  }
}
