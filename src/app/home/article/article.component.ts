import { ArticleService } from './../../core/article.service';
import { Observable } from 'rxjs/Rx';
import { LoginService, User } from '../../core';
import { ActivatedRoute, Router } from '@angular/router';
import { Article } from './../../core/article';
import { Input, ViewChild, ViewContainerRef } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

@Component({
  selector: 'article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css']
})
export class ArticleComponent implements OnInit {
  @Input() article: Article;
  user: User;
  likesFlag; // 当前作者是否已给此文章点过赞

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private loginService: LoginService,
    private articleService: ArticleService,
    public toastr: ToastsManager,
    private vcr: ViewContainerRef
  ) {
    this.likesFlag = false;
  }

  ngOnInit() {
    this.toastr.setRootViewContainerRef(this.vcr);
    this.loginService.loginUser.subscribe(user => this.user = user);

    this.articleService.getArticleLikesFlag(this.article.id, this.user ? this.user.id : -1)
      .subscribe(flag => this.likesFlag = flag); // 查询是否给此文章点过赞，若为登录，则统一是未点赞
  }

  /**
   * 点击每个文章概要跳转至文章详情
   *
   * @param {number} articleId  文章id
   *
   * @memberof ArticleListComponent
   */
  showDetail() {
    this.articleService.addArticleVisitCount(this.article.id)
      .subscribe(result => {
        if (result) {
          this.article.visitCount++;
          this.router.navigate(['../article-detail', this.article.id], { relativeTo: this.route });
        } else {
          console.error(`增加文章阅读量失败`);
        }
      });
  }


  /**
   * 点赞需确认当前用户是否之前有给此文章点过赞
   *
   * @memberof ArticleComponent
   */
  toggleLike() {
    if (!this.user) {
      this.toastr.info('请先登录', '提示', {
        toastLife: 2500,
        positionClass: 'toast-top-center'
      });
    } else {
      this.articleService.toggleArticleLikesCount(this.article.id, this.user.id)
        .subscribe(result => {
          if (!result) { // result标志后台操作是否成功
            return;
          }

          if (this.likesFlag) { // 已点过赞，则取消点赞
            (this.article.likesCount > 0) ? this.article.likesCount-- : 0;
          } else { // 未点赞
            this.article.likesCount++;
          }
          this.likesFlag = !this.likesFlag;
        });
    }
  }


  /**
   * 分享文章
   *
   * @memberof ArticleComponent
   */
  share() {
    this.articleService.addArticleSharedCount(this.article.id)
      .subscribe(result => {
        if (result) {
          this.article.sharedCount++;
        } else {
          console.error(`分享文章失败`);
        }
      });
  }
}
