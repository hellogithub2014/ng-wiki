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
  availableOperation: string;

  constructor(
    public loginService: LoginService,
    public authorService: AuthorService,
    public router: Router,
    public http: Http
  ) {
    this.availableOperation = '登录';
  }

  ngOnInit() {
    this.loginService.loginStatus
      .combineLatest(this.loginService.loginUser, (hasLogin, user) => ({ hasLogin, user }))
      .subscribe(({ hasLogin, user }) => {
        if (hasLogin && user) {
          this.currentUser = user;
          this.availableOperation = '注销';
        } else {
          this.currentUser = null;
          this.availableOperation = '登录';
        }
      });
    this.echo();
  }

  echo() {
    this.http.post('/echo/echo.do', { test: 'testecho' }).subscribe(response => {
      console.log('echo------>', response);
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
