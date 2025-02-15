import {Component, EventEmitter, Input, OnInit, Optional, Output, Self} from '@angular/core';
import {ControlValueAccessor, NgControl} from "@angular/forms";
import { format } from 'date-fns';
@Component({
  selector: 'app-time-picker',
  templateUrl: './time-picker.component.html',
  styleUrls: ['./time-picker.component.less']
})
export class TimePickerComponent implements OnInit, ControlValueAccessor  {

  @Input() placeHolder = 'dd/mm/yyyy';
  @Input() labelContent!: string;
  @Input() errorTip!: string;
  @Input() disabled = false;
  @Input() required = false;
  @Input() name = 'birthdate';
  @Input() span = 16;
  @Input() format = 'DD/MM/YYYY';
  @Input() hideLabel = false;
  @Input() labelHorizontal = true;
  @Input() classWidth: any;
  @Input() isFilterList = false;
  @Input() isVisibilityLabel = false;
  @Input() formController: any;
  @Input() ngStyleCus : any;
  @Output() changeDate: EventEmitter<Date> = new EventEmitter<Date>();

  date!: string;

  constructor(
    @Optional() @Self() public ngControl: NgControl,
  ) {
    // if (this.ngControl != null && this.ngControl.control instanceof FormControl) { // Kiểm tra xem ngControl.control có phải là FormControl không
    //   this.ngControl.valueAccessor = this;
    // }
    if (this.ngControl != null) {
      this.ngControl.valueAccessor = this;
    }
  }

  ngOnInit() {
    if (!this.errorTip) {
      this.errorTip = this.labelContent + ' ' + "không được để trống";
    }
  }

  writeValue(obj: any): void {
    if (obj instanceof Date) {
      this.date = format(obj, 'dd/MM/yyyy'); // Thêm tham số chuỗi định dạng 'dd/MM/yyyy'
    }
  }

  registerOnChange(fn: any): void {
  }

  registerOnTouched(fn: any): void {
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onChange(event: any) {
    this.changeDate.emit(event);
  }

}
