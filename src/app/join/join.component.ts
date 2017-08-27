import { User } from './../core/user';
import { ToastService, toastServiceProvider } from '../core/services/toast.service';
import { Router } from '@angular/router';
import { departments } from '../core/author';
import { Author, AuthorService, LoginService } from '../core/';
import { AfterViewChecked, Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'join',
  templateUrl: './join.component.html',
  styleUrls: ['./join.component.css'],
  providers: [toastServiceProvider]
})
export class JoinComponent implements AfterViewChecked {
  defaultAuthorInfo = {
    name: '',
    ystNumber: '',
    department: departments[0],
    speciality: '',
    hobby: '',
  }; // 新注册用户的初始默认数值

  validDepartments = departments;

  authorForm: NgForm;
  @ViewChild('authorForm') currentForm: NgForm;

  formErrors = {
    'ystNumber': '',
    'name': '',
    'department': '',
  };

  validationMessages = {
    'ystNumber': {
      'required': '不能为空，示范：374787',
      'minlength': '一事通账号至少6位',
      'maxlength': '一事通账号最多6位',
      'onlyNumber': '只能输入数字',
    },
    'name': {
      'required': '姓名不能为空'
    },
    'department': {
      'required': '部门不能为空'
    }
  };

  constructor(
    private router: Router,
    private authorService: AuthorService,
    private loginService: LoginService,
    private toastService: ToastService,
    private vcr: ViewContainerRef,
  ) {
  }

  get diagnostic() { return JSON.stringify(this.defaultAuthorInfo); }

  onSubmit() {
    this.addToApproval();
  }


  /**
   * 提交注册信息进行审批，审批通过后注册成为新用户
   *
   * TODO： 注册成功后，导航栏没有变成注销，用户也没有在列表第一个
   *
   * @memberof JoinComponent
   */
  addToApproval() {
    let newUser: User = null;
    // 先注册
    this.authorService.addAuthor(this.defaultAuthorInfo)
      .do(newAuthor => {
        if (newAuthor) {
          this.toastService.success('注册成功');
        } else {
          this.toastService.error('注册失败');
        }
      }, err => this.toastService.error('注册失败')
      )
      .filter(newAuthor => !!newAuthor)
      // 再登录
      .switchMap(newAuthor => {
        newUser = Object.assign(newAuthor, { email: '' });
        return this.loginService.login(newUser);
      })
      .filter(loginResult => loginResult.status === true)
      .do(_ => {
        this.toastService.success('登录成功');
        this.authorService.unshiftAuthor(newUser); // 将用户加入作者队列中的最前面
      }, err => this.toastService.error('登录失败')
      )
      // 最后跳转到首页
      .subscribe(_ => this.router.navigate(['/home']));
  }

  ngAfterViewChecked() {
    this.formChanged();
  }

  formChanged() {
    if (this.currentForm === this.authorForm) { return; }
    this.authorForm = this.currentForm;
    if (this.authorForm) {
      this.authorForm.valueChanges
        .subscribe(data => this.onValueChanged(data));
    }
  }

  onValueChanged(data?: any) {
    if (!this.authorForm) { return; }
    const form = this.authorForm.form;

    // tslint:disable-next-line:forin
    for (const field in this.formErrors) {
      // clear previous error message (if any)
      this.formErrors[field] = '';
      const control = form.get(field);

      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        // tslint:disable-next-line:forin
        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + ' ';
        }
      }
    }
  }
}
