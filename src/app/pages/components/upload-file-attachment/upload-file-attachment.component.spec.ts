import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadFileAttachmentComponent } from './upload-file-attachment.component';

describe('UploadFileAttachmentComponent', () => {
  let component: UploadFileAttachmentComponent;
  let fixture: ComponentFixture<UploadFileAttachmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadFileAttachmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadFileAttachmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
