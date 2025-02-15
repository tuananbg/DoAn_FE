import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NzButtonSize, NzButtonType } from 'ng-zorro-antd/button';

@Component({
  selector: 'app-button-create',
  templateUrl: './button-create.component.html',
  styleUrls: ['./button-create.component.less']
})
export class ButtonCreateComponent implements OnInit {

  @Input() text: string = '';
  @Input() buttonType: NzButtonType = "primary";
  @Input() buttonSize: NzButtonSize = "large";
  @Input() loading = false;
  @Output() clickCreate = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  openCreate() {
    this.clickCreate.emit();
  }

}
