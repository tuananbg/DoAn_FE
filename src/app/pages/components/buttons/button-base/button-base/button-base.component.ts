import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NzButtonShape, NzButtonSize, NzButtonType } from 'ng-zorro-antd/button';
import {ThemeType} from "@ant-design/icons-angular";

@Component({
  selector: 'app-button-base',
  templateUrl: './button-base.component.html',
  styleUrls: ['./button-base.component.less']
})
export class ButtonBaseComponent implements OnInit {

  @Input() text: string = '';
  @Input() buttonType: NzButtonType = "default";
  @Input() buttonSize: NzButtonSize = "large";
  @Input() buttonClass: string = '';
  @Input() iconType = "question";
  @Input() iconTheme: ThemeType = "outline";
  @Input() disabled = false;
  @Input() buttonShape: NzButtonShape = 'round';
  @Input() iconClass: string = '';
  @Input() iconSpin = false;
  @Input() loading = false;
  @Input() iconFont: string = '';
  @Input() iconRotate: number | null = null;
  @Input() popConfirm = false;
  @Input() confirmOkI18n = "Đồng ý";
  @Input() confirmCancelI18n = "Hủy bỏ";
  @Input() confirmTitleI18n = "Bạn có chắc chắn muốn gửi bản ghi?";
  @Output() clickAction = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  handleClick() {
    this.clickAction.emit();
  }
}
