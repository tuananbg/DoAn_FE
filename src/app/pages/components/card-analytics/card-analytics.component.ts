import {Component, Input, OnInit} from '@angular/core';
import DevExpress from "devextreme";
import PositionConfig = DevExpress.PositionConfig;

@Component({
  selector: 'app-card-analytics',
  templateUrl: './card-analytics.component.html',
  styleUrls: ['./card-analytics.component.less']
})
export class CardAnalyticsComponent {

  @Input() titleText!: string;

  @Input() contentClass!: string;

  @Input() isMenuVisible = true;

  @Input() isLoading = false;
  menuItems: Array<{ text: string }> = [
    { text: 'Configure' },
    { text: 'Remove' },
  ];

  position!: PositionConfig;

}
