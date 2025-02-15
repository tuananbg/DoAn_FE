import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

export enum ToasterPosition {
  bottomRight = 'toast-bottom-right',
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(
    private toastrService: ToastrService,
  ) {
    this.toastrService.toastrConfig.closeButton = true;
  }

  openSuccessToast(message?: string, title?: string) {
    this.toastrService.success(message, title ? title : 'Thành công!' );
  }

  openErrorToast(message: string, title?: string) {
    this.toastrService.error(message, title ? title : "Lỗi!");
  }

  openWarningToast(message?: string, title?: string) {
    this.toastrService.warning(message, title ? title : "Cảnh báo!");
  }

  openInfoToast(message?: string, title?: string) {
    this.toastrService.info(message, title ? title : "Thông báo!");
  }
}
