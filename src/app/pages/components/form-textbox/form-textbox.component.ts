import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { ValidationRule } from 'devextreme-angular/common';
@Component({
  selector: 'app-form-textbox',
  templateUrl: './form-textbox.component.html',
  styleUrls: ['./form-textbox.component.less']
})
export class FormTextboxComponent implements OnInit {

  @Input() isEditing = false;

  @Input() text!: string;

  @Input() isEditText = false;

  @Input() label = '';

  @Input() isStyleTop = false;

  @Input() mask: string = '';

  @Input() icon: string = '';

  @Input() validators: ValidationRule[] = [{ type: 'required' }];

  @Input() value!: string;

  @Output() valueChange = new EventEmitter<string>();

  valueChanged(e : any) {
    this.valueChange.emit(e.value);
  }

  ngOnInit(): void {
  }

}
