import { AbstractControl, FormControl } from '@angular/forms';
export class WikiValidators {
  static onlyNumber(control: AbstractControl): { [s: string]: boolean } {
    const value = control.value;
    if (!value || !value.match(/^\d+$/)) {
      // 这里返回的对象中的键值会出现在校验失败的control.errors对象的键中
      return { 'onlyNumber': true };
    }
  }
}
