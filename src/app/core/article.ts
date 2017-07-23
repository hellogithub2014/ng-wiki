import { Author, mockAuthors } from './author';
import ulid from 'ulid';


export class Article {
  constructor(
    public id: string,
    public authorId: number,
    public title: string,
    public content: string,
    public visitCount?: number,
    public likesCount?: number,
    public sharedCount?: number,
  ) {
    this.visitCount = 0;
    this.likesCount = 0;
    this.sharedCount = 0;
  }
}

const tempArticles: Article[] = [];
for (let i = 0; i < mockAuthors.length * 4; i++) {
  tempArticles.push(new Article(ulid(), -1, `初始mock文章${i}标题`, `初始mock文章1内容`));
}
export let mockArticles: Article[] = tempArticles;
