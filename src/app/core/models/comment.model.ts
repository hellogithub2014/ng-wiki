import * as moment from 'moment';

export class Comment {
  id: number; // 唯一id
  articleId: number; // 回复的文章id
  content: string; // 内容
  date: string; // 日期
  userId: number; // 写评论的用户id
  userName: string; // 写评论的用户名
  replyList: number[]; // 回复此评论的列表
  to: number; // 此评论回复的某个其他评论的id，若是直接回复的文章，则to为-1

  constructor(value: {
    articleId: number,
    content: string,
    userId: number,
    userName: string,
    to?: number,
  }) {
    this.id = Math.floor(Math.random() * (Math.pow(2, 53) - 1)); // 随机数
    this.articleId = value.articleId;
    this.content = value.content;
    this.date = moment().format('YYYY-MM-DD HH:mm:ss'); // 当前日期
    this.userId = value.userId;
    this.userName = value.userName;
    this.replyList = [];
    this.to = value.to || -1; // -1不是任何有效的评论id
  }
}
