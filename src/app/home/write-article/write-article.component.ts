import { Observable } from 'rxjs/Rx';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { ArticleService, AuthorService } from '../../core';
import { Author } from 'app/core';

@Component({
  selector: 'write-article',
  templateUrl: './write-article.component.html',
  styleUrls: ['./write-article.component.css']
})
export class WriteArticleComponent implements OnInit {
  public author$: Observable<Author>; // 作者流，切换切换列表时会变化
  public author: Author;

  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public authorService: AuthorService,
    public articleService: ArticleService,
  ) { }

  ngOnInit() {
    // this.route.params
    //   .map((params: Params) => this.articleId = params['articleId'])
    //   .switchMap((articleId: string) => this.articleService.getArticleById(articleId))

    // 获取作者流
    this.author$ = this.route.params
      .map((params: Params) => {
        console.log('params', params);
        return +params['authorId'];
      }) // get author id
      .switchMap((authorId: number) => this.authorService.getAuthorById(authorId)) // get author by id
      .do(author => {
        this.author = author;
      }, console.error, console.log);
  }

  /**
   * 保存文章给当前作者
   *
   * @param {{ title: string, content: string }} article
   * @memberof WriteArticleComponent
   */
  saveArticle(article: { title: string, content: string }) {
    const newArticle = this.articleService.createArticle(this.author.id, article.title, article.content);
    this.authorService.addArticleToAuthor(newArticle, this.author);
    this.articleService.addArticles(newArticle);

    this.router.navigate(['../', this.author.id], { relativeTo: this.route });
  }
}
