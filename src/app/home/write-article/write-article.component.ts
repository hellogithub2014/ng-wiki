import { Observable } from 'rxjs/Rx';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';

import { MarkdownEditorComponent } from './../../shared/components/markdown-editor/markdown-editor.component';

import { ArticleService, AuthorService } from '../../core';
import { Author } from 'app/core';
import { DialogService } from '../../core/dialog.service';
import { CanComponentDeactivate } from './can-deactive-guard.service';

@Component({
  selector: 'write-article',
  templateUrl: './write-article.component.html',
  styleUrls: ['./write-article.component.css']
})
export class WriteArticleComponent implements OnInit, CanComponentDeactivate {
  public author: Author;
  @ViewChild(MarkdownEditorComponent) markdownEditor: MarkdownEditorComponent;

  savedNewArticle: boolean; // 是否正在保存一篇新文章

  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public authorService: AuthorService,
    public articleService: ArticleService,
    public dialogService: DialogService,
  ) {
    this.savedNewArticle = false;
  }

  ngOnInit() {
    // this.route.params
    //   .map((params: Params) => this.articleId = params['articleId'])
    //   .switchMap((articleId: string) => this.articleService.getArticleById(articleId))

    // 获取作者流
    this.route.params
      .map((params: Params) => {
        console.log('params', params);
        return +params['authorId'];
      })
      .switchMap((authorId: number) => this.authorService.getAuthorById(authorId)) // get author by id
      .subscribe(author => {
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
    this.articleService.createArticle(this.author.id, article.title, article.content)
      .subscribe(newArticle => {
        this.authorService.addArticleToAuthor(newArticle, this.author);
        this.articleService.addArticles(newArticle);

        this.savedNewArticle = true; // 设置标志，以绕过CanDeactice路由守卫

        // 因为当前的url为write-article/:authorId，一个../是取代掉:authorId的部分
        this.router.navigate(['../../article-list', { authorId: this.author.id }], { relativeTo: this.route });
      });
  }

  canDeactivate(): Promise<boolean> | boolean {
    if (this.savedNewArticle) {
      return true;
    }

    const article = this.markdownEditor.currentArticle;
    // 如果没有正在写文章，那么允许直接离开
    if (!article || (article.title === '' && article.content === '')) {
      return true;
    }
    // Otherwise ask the user with the dialog service and return its
    // promise which resolves to true or false when the user decides
    return this.dialogService.confirm('Discard changes?');
  }
}
