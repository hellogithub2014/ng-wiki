import {
  AfterViewInit,
  Component,
  OnInit,
  Output,
  QueryList,
  ViewChildren,
  ViewContainerRef,
  EventEmitter
} from '@angular/core';

import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { EditorComponent } from './editor/editor.component';

@Component({
  selector: 'markdown-editor',
  templateUrl: './markdown-editor.component.html',
  styleUrls: ['./markdown-editor.component.css']
})
export class MarkdownEditorComponent implements OnInit {
  @Output() artcileSave: EventEmitter<{ title: string, content: string }> = new EventEmitter();

  public currentArticle: { title: string, content: string };

  constructor(public toastr: ToastsManager, vcr: ViewContainerRef) {
    this.toastr.setRootViewContainerRef(vcr);
  }
  ngOnInit() {
    this.style = {
      'height.px': window.innerHeight
      // 'height.px': 500,
    };
  }
  save(event) {
    console.log(event);
    this.toastr.success('保存成功！', '系统提示')
      .then(_ => {
        this.artcileSave.emit({ title: event.title, content: event.value });
      });
  }

  change(event) {
    console.log(event);
    this.currentArticle = event;
  }

  // tslint:disable-next-line:member-ordering
  style: any;
  setHeight(e) {
    this.style = {
      'height.px': e.target.innerHeight
    };
  }

}
