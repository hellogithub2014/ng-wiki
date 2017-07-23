import { LoginService } from '../core/login.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthorService } from './../core/author.service';
import { Observable, Subscription } from 'rxjs/Rx';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Author } from 'app/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  authors: Author[] = [];
  private authorsSubscription: Subscription;

  constructor(
    private authorService: AuthorService,
    private route: ActivatedRoute,
    private router: Router,
    private loginService: LoginService,
  ) { }

  ngOnInit() {
    this.authorsSubscription = this.authorService.getAllAuthors()
      .subscribe(authors => {
        this.authors = authors;
        // 初始时默认导航到第一个
        this.router.navigate(['./article-list', { authorId: authors[0].id }], { relativeTo: this.route });
      });
  }

  ngOnDestroy(): void {
    console.log(`destroy HomeComponent`);
    this.authorsSubscription.unsubscribe();
  }
}
