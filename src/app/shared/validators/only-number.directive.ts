import { WikiValidators } from './validators';
import { AbstractControl, NG_VALIDATORS, Validator } from '@angular/forms';
import { Directive, OnChanges, Input } from '@angular/core';

@Directive({
  selector: '[onlyNumber]',
  providers: [{ provide: NG_VALIDATORS, useExisting: OnlyNumberDirective, multi: true }]
})
export class OnlyNumberDirective implements Validator {
  @Input() forbiddenName: string;

  constructor() { }

  validate(control: AbstractControl): { [key: string]: any } {
    return WikiValidators.onlyNumber(control);

  }
}
