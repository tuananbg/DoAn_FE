import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ScreenService} from "../../../service/screen.service";
import {DxTabsTypes} from "devextreme-angular/ui/tabs";
import {Dates} from "../../dashboard/dashboard/dashboard.component";

export type PanelItem = { text: string, value: string, key: number };
@Component({
  selector: 'app-toolbar-analytics',
  templateUrl: './toolbar-analytics.component.html',
  styleUrls: ['./toolbar-analytics.component.less']
})
export class ToolbarAnalyticsComponent {

  @Input() selectedItems!: Array<number>;

  @Input() titleText!: string;

  @Input() panelItems!: Array<PanelItem>;

  @Output() selectionChanged = new EventEmitter<Dates>();

  constructor(protected screen: ScreenService) { }

  selectionChange(e: DxTabsTypes.SelectionChangedEvent) {
    const dates = e.addedItems[0].value.split('/');

    this.selectionChanged.emit({ startDate: dates[0], endDate: dates[1] });
  }

}
