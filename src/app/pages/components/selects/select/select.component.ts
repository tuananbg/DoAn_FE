import { Component, EventEmitter, Input, OnInit, Optional, Output, Self } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { NzSelectModeType, NzSelectSizeType } from 'ng-zorro-antd/select';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.less']
})
export class SelectComponent implements ControlValueAccessor, OnInit {

  @Input() labelContent!: string;
  @Input() getObjectValue = false;
  @Input() errorTip!: string;
  @Input() placeHolder!: string;
  @Input() disabled = false;
  @Input() required = false;
  @Input() data!: any[];
  @Input() valueField = 'id';
  @Input() labelField = 'name';
  @Input() customLabelField = '';
  @Input() openSearchModal = true;
  @Input() name = 'select';
  @Input() span = 16;
  @Input() labelHorizontal = true;
  @Input() hideLabel = false;
  @Input() nzMode: NzSelectModeType = 'default';
  @Input() nzSize: NzSelectSizeType = 'large';
  @Input() isCreateReport = false;
  @Input()  statusError!: string;
  @Input() isOpenCreateModal = false;
  @Input() staticLabelField = true;
  @Input() isVisibilityLabel = false;
  @Input() isCustomLabel = false;
  @Output() clickSearch = new EventEmitter<string>();
  @Output() clickOpenSearch = new EventEmitter();
  @Output() clickClear = new EventEmitter();
  @Output() selectChange = new EventEmitter<any>();
  @Input() isShowClear: any =true;
  @Input() isShowError = true;
  @Input() valueFieldId = true;
  @Input() textDisable!: string;
  @Input() formController: any;
  @Input() ngStyleCus: any;

  spanLabel = 24 - this.span;
  value: any;
  notFoundContent = "Không có kết quả tìm kiếm";
  @Input() maxSelectDisplay: any = 2;
  @Input() isSearch: any = true;

  constructor(
    @Optional() @Self() public ngControl: NgControl,
  ) {
    if (this.ngControl != null) {
      this.ngControl.valueAccessor = this;
    }
  }

  ngOnInit() {
    if (!this.errorTip && this.isShowError) {
      this.errorTip = this.labelContent + ' không được để trống';
    }
  }

  writeValue(obj: any): void {
  }

  registerOnChange(fn: any): void {
  }

  registerOnTouched(fn: any): void {
  }

  setDisabledState?(isDisabled: boolean): void {
  }

  handleSearch(value: string | undefined) {
    this.clickSearch.emit(value);
  }

  handleOpenSearch() {
    this.clickOpenSearch.emit();
  }

  handleSelectChange() {
    if (this.value == null) {
      this.clickClear.emit()
    }
    if (Array.isArray(this.data) && this.data.length > 0) {
      if (this.getObjectValue) {
        const result = Array.isArray(this.value) ?
          this.value.map(x => this.data.find(y => y[this.valueField] === x)) :
          this.data.find(x => x[this.valueField] === this.value);
        this.selectChange.emit(result);
      } else {
        this.selectChange.emit(this.value);
      }
    }

  }

}
