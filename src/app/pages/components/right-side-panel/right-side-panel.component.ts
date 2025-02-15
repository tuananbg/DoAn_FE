import {Component, EventEmitter, HostBinding, Input, OnInit, Output} from '@angular/core';
import {ScreenService} from "../../../service/screen.service";

@Component({
  selector: 'app-right-side-panel',
  templateUrl: './right-side-panel.component.html',
  styleUrls: ['./right-side-panel.component.less']
})
export class RightSidePanelComponent {

  @Input() isOpened = false;

  @Input() showOpenButton = true;

  @Input() title = '';

  @Output() openedChange = new EventEmitter<boolean>();

  @HostBinding('class.overlapping') get overlapping() { return !this.isLarge; };

  @HostBinding('class.closed-state-hidden') get closedStateHidden() { return !this.showOpenButton; };

  @HostBinding('class.open') get open() { return this.isOpened; };

  isLarge = this.screen.sizes['screen-large'];

  constructor(protected screen: ScreenService) {
    screen.screenChanged.subscribe(({isLarge, isXLarge}) => {
      this.isLarge = isLarge || isXLarge;
    });
  }


  toggleOpen = () => {
    this.isOpened = !this.isOpened;
    this.openedChange.emit(this.isOpened);
  };

}
