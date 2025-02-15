import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NzButtonSize, NzButtonType} from "ng-zorro-antd/button";

@Component({
  selector: 'app-button-confirm',
  templateUrl: './button-confirm.component.html',
  styleUrls: ['./button-confirm.component.less']
})
export class ButtonConfirmComponent implements OnInit {
  @Input() text: string = '';
  @Input() buttonType: NzButtonType = 'primary';
  @Input() buttonSize: NzButtonSize = 'large';
  @Input() disableButton = false;
  @Output() clickConfirm = new EventEmitter();

  @Input() isEdit = false;

  constructor() {
  }

  ngOnInit() {
  }

  confirm() {
    this.clickConfirm.emit();
  }

}
