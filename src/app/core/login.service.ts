import { DataService } from './services/data.service';
import { Observable, BehaviorSubject } from 'rxjs/Rx';
import { User } from './user';
import { Injectable } from '@angular/core';

@Injectable()
export class LoginService {
  private loginrUrl = '/ngWikiBe/users/login';

  private status: LoginStatus;
  private user: User;

  private status$$: BehaviorSubject<LoginStatus>;
  private user$$: BehaviorSubject<User>;

  constructor(private dataService: DataService) {
    this.status$$ = new BehaviorSubject(LoginStatus.LOGOUT);
    this.user$$ = new BehaviorSubject(null);
    this.update(null, LoginStatus.LOGOUT);
  }

  update(user: User, status: LoginStatus) {
    this.user = user;
    this.status = status;

    this.user$$.next(this.user);
    this.status$$.next(this.status);
  }

  /**
   * 登录，若成功了发射出User对象，失败了发射错误信息
   *
   * @param {{ name: string, ystNumber: string }} userInfo  待校验的资料
   * @returns {(Observable<string | User>)}
   * @memberof LoginService
   */
  login(userInfo: { name: string, ystNumber: string }): Observable<{ status: boolean, user?: User, errMsg?: string }> {
    return this.dataService.postData(this.loginrUrl, userInfo)
      .map((result: { status: boolean, user?: User, errMsg?: string }) => {
        if (result.status) {
          this.update(result.user, LoginStatus.LOGIN); // 登录成功，更新相关状态
        }
        return result;
      });
  }


  /**
   * 注销
   *
   * @returns {Observable<boolean>} 注销成功返回true
   * @memberof LoginService
   */
  logout(): Observable<boolean> {
    const statusCopy = this.status;

    this.update(null, LoginStatus.LOGOUT);

    return (statusCopy === LoginStatus.LOGIN) ? Observable.of(true) : Observable.of(false);
  }

  get loginStatus() {
    return this.status$$.asObservable().map(status => (this.status === LoginStatus.LOGIN) ? true : false);
  }

  get loginUser() {
    return this.user$$.asObservable();
  }


  /**
   * 检查此id是否为登录用户的id
   *
   * @param {number} userId
   * @returns
   * @memberof LoginService
   */
  checkIsLoginUser(userId: number) {
    return userId === this.user.id;
  }
}

enum LoginStatus {
  LOGIN,
  LOGOUT,
}
