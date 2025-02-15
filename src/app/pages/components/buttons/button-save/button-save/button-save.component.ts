import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NzButtonSize, NzButtonType } from 'ng-zorro-antd/button';

@Component({
  selector: 'app-button-save',
  templateUrl: './button-save.component.html',
  styleUrls: ['./button-save.component.less']
})
export class ButtonSaveComponent implements OnInit {

  @Input() text: string = '';
  @Input() loading = false;
  @Input() buttonType: NzButtonType = "default";
  @Input() buttonSize: NzButtonSize = "large";
  @Input() isIcon = false;
  @Input() disabled = false;
  @Input() popConfirm = false;
  @Input() confirmOkI18n = "Đồng ý";
  @Input() confirmCancelI18n = "Hủy bỏ";
  @Input() confirmTitleI18n = "Bạn có chắc chắn muốn lưu bản ghi?";
  @Output() clickSave = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  onClickSave() {
    this.clickSave.emit();
  }
}
