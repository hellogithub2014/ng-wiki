import { Observable, BehaviorSubject } from 'rxjs/Rx';
import { User } from './user';
import { Injectable } from '@angular/core';

@Injectable()
export class LoginService {
  private status: LoginStatus;
  private user: User;

  private status$$: BehaviorSubject<LoginStatus>;
  private user$$: BehaviorSubject<User>;

  constructor() {
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

  login(user: User): Observable<boolean> {
    this.update(user, LoginStatus.LOGIN);
    return Observable.of(true);
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
