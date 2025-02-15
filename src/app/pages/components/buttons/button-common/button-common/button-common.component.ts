import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NzButtonType, NzButtonShape } from 'ng-zorro-antd/button';
import { NzSizeLDSType } from 'ng-zorro-antd/core/types';
import {ThemeType} from "@ant-design/icons-angular";

@Component({
  selector: 'app-button-common',
  templateUrl: './button-common.component.html',
  styleUrls: ['./button-common.component.less']
})
export class ButtonCommonComponent implements OnInit {

  @Input() buttonText = '';
  @Input() buttonType: NzButtonType = "primary";
  @Input() buttonSize: NzSizeLDSType = "large";
  @Input() buttonClass: string = '';
  @Input() iconType = "";
  @Input() iconTheme: ThemeType = "outline";
  @Input() disabled = false;
  @Input() buttonShape: NzButtonShape = 'round';
  @Input() iconClass: string = '';
  @Input() iconStyle: { [klass: string]: any; } | null = null;
  @Input() iconSpin = false;
  @Input() loading = false;
  @Input() iconFont: string = '';
  @Input() iconRotate: number | null = null;
  @Input() popConfirm = false;
  @Input() confirmOkI18n = "Đồng ý";
  @Input() confirmCancelI18n = "Hủy bỏ";
  @Input() confirmTitleI18n = "Bạn có chắc chắn muốn gửi bản ghi?";
  @Input() tooltipTitle = '';
  @Input() isRotate: boolean | undefined;
  @Input() iconTypeRight = '';

  @Output() clickAction = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  handleClick() {
    this.clickAction.emit();
  }

}
