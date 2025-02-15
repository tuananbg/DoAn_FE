import { Component, ElementRef, EventEmitter, Input, OnInit, Optional, Output, Self, ViewChild } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { NzSizeLDSType } from 'ng-zorro-antd/core/types';

@Component({
  selector: 'app-input-text-v2',
  templateUrl: './input-text-v2.component.html',
  styleUrls: ['./input-text-v2.component.less']
})
export class InputTextV2Component implements ControlValueAccessor, OnInit {

  @ViewChild('inputRef', { static: false }) inputRef?: ElementRef<HTMLInputElement>;

  @Input() nzSize: NzSizeLDSType = 'large';
  @Input() label = '';
  @Input() label2 = '';
  @Input() hiddenLabel = false;
  @Input() required = false;
  @Input() placeHolder = '';
  @Input() nzAllowClear = false;
  @Input() formController: any;
  @Input() ngClass: any;
  @Input() isNoSpecial = false;
  @Input() isDisabled = false;
  @Input() isUpperCase = false;
  @Input() typeInput = 'text';
  @Input() controlName = '';
  @Input() ngStyleCus : any;
  @Input() numberMax : any;

  @Output() eventFocus = new EventEmitter<any>();
  @Output() eventBlur = new EventEmitter<any>();

  isFocused = false;

  //
  @Input() maxlength!: string;

  constructor(
    @Optional() @Self() public ngControl: NgControl,
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

  focus() {
    this.inputRef!.nativeElement.focus();
  }

  onFocus(event: any) {
    this.isFocused = true;
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

  onChange(event: any) {
    if (this.isUpperCase && this.ngControl.control?.value) {
      this.ngControl.control.setValue(this.ngControl.control.value.toUpperCase());
    }
  }

  checkNgClassHasW100() {
    if (typeof this.ngClass === 'string') {
      return this.ngClass.includes('w-100');
    } else if (typeof this.ngClass === 'object') {
      return this.ngClass.hasOwnProperty('w-100');
    }
    return false;
  }

  checkMaxValue(event: any) {
    if(this.numberMax){
      const value = event.target.value;
      if (value > 100) {
        event.target.value = 100;
      }
    }
  }

}
