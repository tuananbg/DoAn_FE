import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NzButtonSize, NzButtonType } from 'ng-zorro-antd/button';

@Component({
  selector: 'app-button-cancel',
  templateUrl: './button-cancel.component.html',
  styleUrls: ['./button-cancel.component.less']
})
export class ButtonCancelComponent implements OnInit {

  @Input() text = '';
  @Input() buttonType: NzButtonType = "default";
  @Input() buttonSize: NzButtonSize = "large";
  @Input() popConfirm = true;
  @Input() confirmOkI18n = "Đồng ý";
  @Input() confirmCancelI18n = "Từ chối";
  @Input() confirmTitleI18n = "Dữ liệu nhập chưa được lưu lại, bạn có muốn đóng không?";
  @Input() isIcon = false;
  @Output() clickCancel = new EventEmitter();

  constructor() {
  }

  ngOnInit() {
  }

  onConfirm() {
    this.clickCancel.emit();
  }

}
