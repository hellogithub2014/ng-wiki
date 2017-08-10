export class Comment {
  id: number;
  articleId: string;
  content: string;
  date: string;
  userId: number;
  replyList: number[]; // 回复列表
}
