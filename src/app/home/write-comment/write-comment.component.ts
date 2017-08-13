import { Component, Inject, OnInit } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'write-comment',
  templateUrl: './write-comment.component.html',
  styleUrls: ['./write-comment.component.css']
})
export class WriteCommentComponent implements OnInit {
  replyContent: string;

  constructor(
    public dialogRef: MdDialogRef<WriteCommentComponent>,
    @Inject(MD_DIALOG_DATA) public navParams: { commentContent: string }
  ) {
    this.replyContent = '';
  }

  ngOnInit() {
  }

  get canReply() {
    return this.replyContent.trim() !== '';
  }

  close() {
    this.dialogRef.close('');
  }

  submitReply() {
    this.dialogRef.close(this.replyContent);
  }
}
