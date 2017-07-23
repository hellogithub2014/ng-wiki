import { Component, OnInit, ViewContainerRef, AfterViewInit, ViewChildren, QueryList } from '@angular/core';

import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { EditorComponent } from './editor/editor.component';

@Component({
  selector: 'markdown-editor',
  templateUrl: './markdown-editor.component.html',
  styleUrls: ['./markdown-editor.component.css']
})
export class MarkdownEditorComponent implements OnInit, AfterViewInit {

  @ViewChildren(EditorComponent)
  items: QueryList<EditorComponent>;

  ngAfterViewInit() {
    console.log(this.items);
  }
  constructor(public toastr: ToastsManager, vcr: ViewContainerRef) {
    this.toastr.setRootViewContainerRef(vcr);
  }
  ngOnInit() {
    console.log(this.items);
    this.style = {
      'height.px': window.innerHeight
      // 'height.px': 500,
    };
  }
  save(event) {
    console.log(event);
    this.toastr.success('保存成功！', '系统提示');
  }

  // tslint:disable-next-line:member-ordering
  style: any;
  setHeight(e) {
    this.style = {
      'height.px': e.target.innerHeight
    };
  }

}
