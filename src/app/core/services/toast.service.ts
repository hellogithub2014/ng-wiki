import { Injectable, ViewContainerRef } from '@angular/core';
import { ToastsManager, Toast } from 'ng2-toastr/ng2-toastr';

@Injectable()
export class ToastService {
  constructor(
    public toastr: ToastsManager,
    public vcr: ViewContainerRef,
  ) {
    this.toastr.setRootViewContainerRef(vcr);
  }

  error(message: string, title?: string, options?: any): Promise<Toast> {
    return this.toastr.success(message, title, options);
  }
  info(message: string, title?: string, options?: any): Promise<Toast> {
    return this.toastr.success(message, title, options);
  }
  success(message: string, title?: string, options?: any): Promise<Toast> {
    return this.toastr.success(message, title, options);
  }
  warning(message: string, title?: string, options?: any): Promise<Toast> {
    return this.toastr.success(message, title, options);
  }

}


const toastServiceFactory = (toastr: ToastsManager, vcr: ViewContainerRef) => {
  return new ToastService(toastr, vcr);
};

export let toastServiceProvider = {
  provide: ToastService,
  useFactory: toastServiceFactory,
  deps: [ToastsManager, ViewContainerRef]
};
