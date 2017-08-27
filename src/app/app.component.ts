import { AuthorService } from './core/author.service';
import { Router } from '@angular/router';
import { User } from './core/user';
import { LoginService } from './core/login.service';
import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  currentUser: User;
  availableNavLink: string;
  operationsAfterLogin: any[]; // 发现将类型设为Primeng的menuitem语法检查会失败

  constructor(
    public loginService: LoginService,
    public authorService: AuthorService,
    public router: Router,
    public http: Http
  ) {
    this.availableNavLink = '登录';
    this.operationsAfterLogin = [
      {
        label: '。。。', icon: 'fa-check', // 随便设一个label，等到登录成功后修改掉
        items: [
          [
            {
              label: '分类1',
              items: [{ label: '注销', icon: 'fa-plus', command: (e) => this.logout() }]
            },
          ],
        ]
      },
    ];
  }

  ngOnInit() {
    this.loginService.loginStatus
      .combineLatest(this.loginService.loginUser, (hasLogin, user) => ({ hasLogin, user }))
      .subscribe(({ hasLogin, user }) => {
        if (hasLogin && user) {
          this.currentUser = user;
          this.availableNavLink = '注销';
          this.operationsAfterLogin[0].label = this.currentUser.name; // 修改注销的下拉菜单的名字
        } else {
          this.currentUser = null;
          this.availableNavLink = '登录';
        }
      });
  }

  logout() {
    this.loginService.logout()
      .filter(checkedOut => checkedOut === true)
      .do(_ => {
        this.authorService.shiftAuthor(); // 将用户从作者队列中去除
      })
      .subscribe(checkedOut => this.router.navigate(['/login'])); // 路由跳转到登录页面
  }
}
