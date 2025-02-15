import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-toolbar-form',
  templateUrl: './toolbar-form.component.html',
  styleUrls: ['./toolbar-form.component.less']
})
export class ToolbarFormComponent {

  @Input() isEditing!: boolean;

  @Input() titleClass!: string;

  @Output() editModeToggled = new EventEmitter();

  @Output() saveButtonClicked = new EventEmitter();

  @Output() editingCancelled = new EventEmitter();

  handleCancelEditClick () {
    this.editingCancelled.emit();
  }

  handleEditClick () {
    this.editModeToggled.emit();
  }

  handleSaveButtonClick (event: any) {
    this.saveButtonClicked.emit(event);
  }

}
