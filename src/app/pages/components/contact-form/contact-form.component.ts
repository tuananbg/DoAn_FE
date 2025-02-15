import {Component, Input} from '@angular/core';
import {Contact} from "../../../core/contact";
import {ValidationRule} from "devextreme-angular/common";
import {DxButtonTypes} from "devextreme-angular/ui/button";

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.less']
})
export class ContactFormComponent  {

  @Input() contactData!: Contact;

  @Input() isLoading!: boolean;

  savedData!: Contact;

  isEditing = false;

  zipCodeValidator: ValidationRule = { type: 'pattern', pattern: /^\d{5}$/, message: 'Zip is invalid' };

  handleEditClick() {
    this.savedData = { ...this.contactData };
    this.isEditing = true;
  }

  handleSaveClick({ validationGroup }: DxButtonTypes.ClickEvent) {
    if(!validationGroup.validate().isValid) return;
    this.isEditing = false;
    this.savedData;
  }

  handleCancelClick() {
    this.contactData = { ...this.savedData };
    this.isEditing = false;
  }
}
