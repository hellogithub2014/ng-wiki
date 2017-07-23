import { WikiValidators } from '../shared/validators/validators';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from '../core/login.service';
import { User } from '../core/user';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthorService } from '../core/author.service';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup; // <--- heroForm is of type FormGroup

  user: User;


  formErrors = {
    'name': '',
    'ystNumber': '',
    'email': '',
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
  };


  constructor(
    private fb: FormBuilder, // <--- inject FormBuilder
    private loginService: LoginService,
    private route: ActivatedRoute,
    private router: Router,
    private authorService: AuthorService,
  ) {
    this.user = new User();
    this.createForm();
  }

  ngOnInit(): void {
  }

  /**
   * 构建登录响应式表单
   *
   *
   * @memberof LoginComponent
   */
  createForm() {
    this.loginForm = this.fb.group({
      name: ['', [Validators.required]], // 初始值、验证器
      ystNumber: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6), WikiValidators.onlyNumber]],
      email: '',
    });
    this.loginForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged(); // (re)set validation messages now
  }

  onValueChanged(data?: any) {
    if (!this.loginForm) { return; }
    const form = this.loginForm;

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

  login() {
    const loginModel = this.loginForm.value;

    this.user = Object.assign({}, this.user, {
      name: loginModel.name as string,
      ystNumber: loginModel.ystNumber as string,
      email: loginModel.email as string,
    });

    this.loginService.login(this.user)
      .filter(loginStatus => loginStatus === true)
      .do(_ => {
        this.authorService.unshiftAuthor(this.user); // 将用户加入作者队列中的最前面
      })
      .subscribe(_ => this.router.navigate(['/home']));
  }

}
