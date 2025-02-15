import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {NzButtonShape, NzButtonSize, NzButtonType} from 'ng-zorro-antd/button';

@Component({
  selector: 'app-button-export',
  templateUrl: './button-export.component.html',
  styleUrls: ['./button-export.component.less']
})
export class ButtonExportComponent implements OnInit {

  @Input() text = null;
  @Input() buttonType: NzButtonType = "default";
  @Input() buttonSize: NzButtonSize = "large";
  @Input() buttonShape: NzButtonShape = 'round';
  @Input() isMarginRight = true;
  @Input() buttonClass: string = '';
  @Output() clickExport = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  openExport() {
    this.clickExport.emit();
  }
}
