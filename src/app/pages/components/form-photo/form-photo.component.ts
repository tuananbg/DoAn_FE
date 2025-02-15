import { Component, OnInit, ElementRef, Input } from '@angular/core';

@Component({
  selector: 'app-form-photo',
  templateUrl: './form-photo.component.html',
  styleUrls: ['./form-photo.component.less']
})
export class FormPhotoComponent implements OnInit {

  @Input() link: any;

  @Input() editable = false;

  @Input() size = 124;

  imageUrl!: string;

  hostRef = this.elRef.nativeElement;

  constructor(private elRef:ElementRef) {}

  ngOnInit() {
    this.imageUrl = `url('http://localhost:8080/api/v1/employee/${this.link}')`;
  }

}
