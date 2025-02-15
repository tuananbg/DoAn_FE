import {Component, Input, OnInit} from '@angular/core';
import {TaskPriority, TaskStatus} from "../../../core/task";

@Component({
  selector: 'app-status-indicator',
  templateUrl: './status-indicator.component.html',
  styleUrls: ['./status-indicator.component.less']
})
export class StatusIndicatorComponent implements OnInit {

  @Input() value!: TaskStatus | TaskPriority;

  @Input() isField = true;

  @Input() showBar = false;

  dashValue = '';

  ngOnInit() {
    this.dashValue = this.spaceToDash(this.value).toLowerCase();
  }

  getValue(value: string): string {
    return (this.showBar ? '| ' : '') + value;
  }

  spaceToDash = (value: TaskStatus) =>
    (value?.replace(/ /g, '-') || '');

}
