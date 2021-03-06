import { Comment } from './models/comment.model';
import { Author, mockAuthors } from './author';
import ulid from 'ulid';

export class Article {
  constructor(
    public id: number,
    public authorId: number,
    public title: string,
    public content: string,
    public visitCount?: number,
    public likesCount?: number,
    public sharedCount?: number,
    public comments?: number[],
  ) {
    this.visitCount = 0;
    this.likesCount = 0;
    this.sharedCount = 0;
    this.comments = [];
  }
}

const tempArticles: Article[] = [];
for (let i = 0; i < mockAuthors.length * 4; i++) {
  tempArticles.push(new Article(ulid(), -1, `初始mock文章${i}标题`, `初始mock文章1内容`));
}
export let mockArticles: Article[] = tempArticles;
