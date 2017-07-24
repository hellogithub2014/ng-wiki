import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'ng2-toastr/ng2-toastr';

import { EditorComponent } from './components/markdown-editor/editor/editor.component';
import { MarkdownEditorComponent } from './components/markdown-editor/markdown-editor.component';
import { OnlyNumberDirective } from './validators/only-number.directive';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ToastModule.forRoot(),
  ],
  declarations: [
    OnlyNumberDirective,
    EditorComponent,
    MarkdownEditorComponent,
  ],
  exports: [
    OnlyNumberDirective,
    MarkdownEditorComponent,
  ],
})
export class SharedModule { }
