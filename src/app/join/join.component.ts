import { Router } from '@angular/router';
import { departments } from '../core/author';
import { Author, AuthorService } from '../core/';
import { AfterViewChecked, Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'join',
  templateUrl: './join.component.html',
  styleUrls: ['./join.component.css']
})
export class JoinComponent implements OnInit, AfterViewChecked {
  newAuthor: Author = new Author(-1, '', '', departments[0]);
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
  ) { }

  ngOnInit() {
  }

  get diagnostic() { return JSON.stringify(this.newAuthor); }

  onSubmit() {
    this.addToApproval();
  }

  addToApproval() {
    this.newAuthor.id = Math.floor(Math.random() * (Math.pow(2, 53) - 1));
    this.authorService.addAuthor(this.newAuthor);
    this.router.navigate(['/home']);
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
