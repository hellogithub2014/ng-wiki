import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Observable } from 'rxjs/Rx';

import { Comment } from '../models/comment.model';

@Injectable()
export class CommentService {
  public commentListURL = 'mock-data/comment-mock.json';

  constructor(public http: Http) { }

  public getCommentList(articleId: string): Observable<Comment[]> {
    return this.http.get(this.commentListURL)
      .map((res: Response) => res.json());
  }
}
