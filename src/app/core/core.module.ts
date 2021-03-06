import { ToastService } from './services/toast.service';
import { DataService } from './services/data.service';
import { CommentService } from './services/comment.service';
import { DialogService } from './dialog.service';
import { LoginService } from './login.service';
import { ArticleService } from './article.service';
import { AuthorService } from './author.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  providers: [
    AuthorService,
    ArticleService,
    LoginService,
    DialogService,
    CommentService,
    DataService,
    // ToastService,
  ],
})
export class CoreModule { }
