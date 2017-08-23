import { Article } from './article';


export const departments: string[] = [
  '对公信息应用开发',
  '数据分析与统计',
  '资产管理',
  '信用卡',
];

export class Author {
  public id: number;
  public name: string;
  public ystNumber: string; // 一事通账号
  public department: string; // 部门
  public articles: number[];
  public speciality: string; // 专长
  public hobby: string; // 爱好

  constructor(
    id: number = 1,
    name: string = '无名氏',
    ystNumber: string = '', // 一事通账号
    department: string = departments[0], // 部门
    articles: number[] = [],
    speciality?: string, // 专长
    hobby?: string, // 爱好
  ) {
    this.id = id;
    this.name = name;
    this.ystNumber = ystNumber;
    this.department = department;
    this.articles = articles;
    this.speciality = speciality || '';
    this.hobby = hobby || '';
  }
}

export let mockAuthors: Author[] = [
  new Author(0, '0号作者', '374787', departments[0]),
  new Author(1, '1号作者', '274681', departments[0]),
  new Author(2, '2号作者', '174979', departments[0]),
];
