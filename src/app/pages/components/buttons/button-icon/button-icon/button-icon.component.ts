import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NzButtonSize, NzButtonType } from 'ng-zorro-antd/button';

@Component({
  selector: 'app-button-icon',
  templateUrl: './button-icon.component.html',
  styleUrls: ['./button-icon.component.less']
})
export class ButtonIconComponent implements OnInit {

  @Input() text = '';
  @Input() buttonType: NzButtonType = 'default';
  @Input() buttonSize: NzButtonSize = 'large';
  @Input() disabled = false;
  @Input() isEdit = false;
  @Input() isViewDetail = false;
  @Input() isContinue = false;
  @Input() isUploadFile = false;
  @Input() isDelete = false;
  @Input() isAdd = false;
  @Input() isAddUser = false;
  @Input() isAddFile = false;
  @Input() loading = false;
  @Input() isDownloadFile = false;
  @Input() isDownloadAllFile = false;
  @Input() isClose = false;
  @Input() isSyn = false;
  @Input() tooltipTitle = ''
  @Output() clickAction = new EventEmitter();

  TOOLTIP = {
    PLACEMENT_TOP: 'top'
  };

  //
  @Input() isUser = false;
  @Input() isFunc = false;
  @Input() isPause= false;
  @Input() isLink = false;
  @Input() isLock = false;
  @Input() isUnlock = false;
  @Input() isAction = false;
  @Input() isBars = false;
  @Input() isCheckCircle = false;
  @Input() isUnCheckCircle = false;

  constructor() { }

  ngOnInit() {
  }

  onClickAction() {
    this.clickAction.emit();
  }

}
