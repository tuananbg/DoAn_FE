import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-inline-message',
  templateUrl: './inline-message.component.html',
  styleUrls: ['./inline-message.component.less']
})
export class InlineMessageComponent implements OnInit {

  @Input() formController: any;
  @Input() field?: any;
  @Input() field2?: any;
  @Input() type?: any;
  @Input() message?:any;
  @Input() message2?:any;
  
  constructor() { }

  ngOnInit(): void {
  }

}
