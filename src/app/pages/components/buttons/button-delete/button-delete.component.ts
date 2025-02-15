import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NzButtonSize, NzButtonType} from "ng-zorro-antd/button";

@Component({
  selector: 'app-button-delete',
  templateUrl: './button-delete.component.html',
  styleUrls: ['./button-delete.component.less']
})
export class ButtonDeleteComponent implements OnInit {

  @Input() text: string = '';
  @Input() buttonType: NzButtonType = 'primary';
  @Input() buttonSize: NzButtonSize = 'large';
  @Input() disabled = false;
  @Input() isCustomPadding = false;
  @Input() isIcon = true;
  @Output() clickDelete = new EventEmitter();

  constructor() {
  }

  ngOnInit() {
  }

  onClickDelete() {
    this.clickDelete.emit();
  }

}
