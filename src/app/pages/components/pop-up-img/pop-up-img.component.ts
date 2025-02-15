import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-pop-up-img',
  templateUrl: './pop-up-img.component.html',
  styleUrls: ['./pop-up-img.component.less']
})
export class PopUpImgComponent implements OnInit {

  @Input() imageUrl!: string;
  @Output() close = new EventEmitter<void>();

  closePopup() {
    this.close.emit();
  }
  constructor() { }

  ngOnInit(): void {
  }


}
