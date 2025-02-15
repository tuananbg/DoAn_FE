import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {DxValidationGroupComponent} from "devextreme-angular";
import {ScreenService} from "../../../service/screen.service";

@Component({
  selector: 'app-form-popup',
  templateUrl: './form-popup.component.html',
  styleUrls: ['./form-popup.component.less']
})
export class FormPopupComponent implements OnInit {

  @ViewChild('validationGroup', { static: true }) validationGroup!: DxValidationGroupComponent;

  @Input() titleText = '';

  @Input() width = 680;

  @Input() height: string | number = 'auto';

  @Input() wrapperAttr: Record<string, string> = {};

  @Input() visible = false;

  @Input() isSaveDisabled = false;

  @Output() save = new EventEmitter();

  @Output() visibleChange = new EventEmitter<boolean>();

  constructor(protected screen: ScreenService) { }

  isValid() {
    return this.validationGroup.instance.validate().isValid;
  }

  onSaveClick() {
    if(!this.isValid()) {
      return
    }

    this.save.emit();
    this.close();
  }

  close() {
    this.validationGroup.instance.reset();
    this.visible = false;

    this.visibleChange.emit(this.visible);
  }

  getWrapperAttrs = (inputWrapperAttr: any) => {
    return {
      ...inputWrapperAttr,
      class: `${inputWrapperAttr.class} form-popup`,
    };
  }

  ngOnInit(): void {
  }

}
