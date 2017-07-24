import { Article, Author, ArticleService, AuthorService, LoginService } from '../../core';
import { Observable, Subject, Subscription, BehaviorSubject } from 'rxjs/Rx';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-article-list',
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.css']
})
export class ArticleListComponent implements OnInit {
  public author: Author;

  public isLoginUser$: Observable<boolean>; // 当前作者是否为登录用户，默认false
  public author$: Observable<Author>; // 作者流，切换切换列表时会变化
  articles$: Observable<Article[]>; // 作者的文章流
  public newArticles$$: BehaviorSubject<Article[]> = new BehaviorSubject([]); // 新文章流

  public createdArticles: Article[] = []; // 当前已创作的新文章

  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public authorService: AuthorService,
    public articleService: ArticleService,
    public loginService: LoginService,
  ) { }

  ngOnInit() {
    // 获取作者流
    this.author$ = this.route.params
      .map((params: Params) => +params['authorId']) // get author id
      .do((authorId: number) => {
        // 在切换列表中的作者时，此组件会被复用，其中存储的各项值不会清空，ngOninit也只会执行一次。所以需要手动清除状态
        console.log(`authorId: ${authorId}`);
        this.createdArticles = [];
        this.newArticles$$.next(this.createdArticles);
      }, console.error, console.log)
      .switchMap((authorId: number) => this.authorService.getAuthorById(authorId)) // get author by id
      .do(author => {
        this.author = author;
      }, console.error, console.log);

    /**
     * 获取文章流
     * 1. 每个作者自身就有的文章
     * 2. 登录用户可以新建的文章
     */
    this.articles$ = this.author$
      .map((author) => {
        this.author = author;
        return author.articles; // get articles of author
      })
      .do(articles => console.log('articles$', articles))
      .combineLatest(this.newArticles$$.asObservable(), (existArticles, newArticles) => { // new articles stream
        return [...existArticles, ...newArticles];
      });

    /**
     * 判断点击的作者是否为登录用户的流
     * 获取作者流和登录流中最新的数据，如果二者的id匹配，那么就认为是当前登录用户
     */
    this.isLoginUser$ = this.author$.combineLatest(this.loginService.loginUser, (author, user) => ({ author, user }))
      .do(({ author, user }) => console.log('isLoginUser$', author, user))
      .map(({ author, user }) => {
        // return (user && author.id === user.id) ? true : false; // 选中的作者是当前已登录的用户
        return true;
      });
  }

  writeNewArticle() {
    // const newArticle = this.articleService.createArticle(this.author.id, `测试给${this.author.name}新增文章-标题`, '测试新增文章-内容');
    // this.authorService.addArticleToAuthor(newArticle, this.author);
    // this.articleService.addArticles(newArticle);

    // this.createdArticles = [...this.createdArticles, newArticle];
    // this.newArticles$$.next(this.createdArticles);
    // TODO:
    // 1. 使用表单
    this.router.navigate(['../write-article', this.author.id], { relativeTo: this.route });
  }
}
