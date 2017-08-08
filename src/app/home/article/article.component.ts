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
    public toastr: ToastsManager,
    private vcr: ViewContainerRef
  ) {
    this.likesFlag = false;
  }

  ngOnInit() {
    this.toastr.setRootViewContainerRef(this.vcr);
    this.loginService.loginUser.subscribe(user => this.user = user);
  }

  /**
   * 点击每个文章概要跳转至文章详情
   *
   * @param {number} articleId  文章id
   *
   * @memberof ArticleListComponent
   */
  showDetail() {
    this.article.visitCount++;
    this.router.navigate(['../article-detail', this.article.id], { relativeTo: this.route });
  }


  /**
   * 点赞需确认当前用户是否之前有给此文章点过赞
   *
   * @memberof ArticleComponent
   */
  toggleFavorite() {
    if (!this.user) {
      this.toastr.info('请先登录', '提示', {
        toastLife: 2500,
        positionClass: 'toast-top-center'
      });
    } else {
      if (this.likesFlag) { // 已点过赞，则取消点赞
        (this.article.likesCount > 0) ? this.article.likesCount-- : 0;
      } else { // 未点赞
        this.article.likesCount++;
      }
      this.likesFlag = !this.likesFlag;
    }
  }

  share() {

  }
}
