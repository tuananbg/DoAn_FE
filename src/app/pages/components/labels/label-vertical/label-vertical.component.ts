import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-label-vertical',
  templateUrl: './label-vertical.component.html',
  styleUrls: ['./label-vertical.component.less']
})
export class LabelVerticalComponent implements OnInit {
  @Input() required = false;
  @Input() noColon = true;
  @Input() content!: string;
  @Input() for!: string;


  constructor() { }

  ngOnInit(): void {
  }

}
