import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormPhotoUploaderComponent } from './form-photo-uploader.component';

describe('FormPhotoUploaderComponent', () => {
  let component: FormPhotoUploaderComponent;
  let fixture: ComponentFixture<FormPhotoUploaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormPhotoUploaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormPhotoUploaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
