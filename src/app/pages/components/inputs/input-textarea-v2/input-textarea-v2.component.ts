import {Component, ElementRef, EventEmitter, Input, OnInit, Optional, Output, Self, ViewChild} from '@angular/core';
import {ControlValueAccessor, NgControl} from "@angular/forms";
import {AutoSizeType} from "ng-zorro-antd/input";

@Component({
  selector: 'app-input-textarea-v2',
  templateUrl: './input-textarea-v2.component.html',
  styleUrls: ['./input-textarea-v2.component.less']
})
export class InputTextareaV2Component implements OnInit, ControlValueAccessor  {

  @ViewChild('inputTextareaRef', {static: false}) inputTextareaRef!: ElementRef<HTMLTextAreaElement>;

  @Input() label = '';
  @Input() label2 = '';
  @Input() hiddenLabel = false;
  @Input() required = false;
  @Input() placeholder = '';
  @Input() minRows = 3;
  @Input() maxRows = 3;
  @Input() nzAutosize: string | boolean | AutoSizeType = { minRows: this.minRows, maxRows: this.maxRows };
  @Input() nzAllowClear = false;
  @Input() formController: any;
  @Input() ngClass = '';
  @Input() ngStyleCus: any;
  @Input() isReadOnly = false;
  @Input() disabled = false;

  @Output() eventFocus = new EventEmitter<any>();
  @Output() eventBlur = new EventEmitter<any>();

  isFocused = false;

  constructor(
    @Optional() @Self() public ngControl: NgControl
  ) {
    if (this.ngControl) this.ngControl.valueAccessor = this;
  }

  ngOnInit() {
  }

  writeValue(obj: any): void {
  }

  registerOnChange(fn: any): void {
  }

  registerOnTouched(fn: any): void {
  }

  setDisabledState?(isDisabled: boolean): void {
  }

  onFocus(event: any) {
    if(!this.isReadOnly){
      this.isFocused = true;
    }
    this.eventFocus.emit(event);
  }

  onBlur(event: any) {
    this.isFocused = false;
    this.eventBlur.emit(event);
  }

  onClear() {
    if (this.formController) this.formController.setValue(null);
    else this.ngControl.control!.setValue(null);
  }

  focus() {
    this.inputTextareaRef.nativeElement.focus();
  }

}
