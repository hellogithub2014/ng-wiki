import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentAreaComponent } from './comment-area.component';

describe('CommentAreaComponent', () => {
  let component: CommentAreaComponent;
  let fixture: ComponentFixture<CommentAreaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommentAreaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommentAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
