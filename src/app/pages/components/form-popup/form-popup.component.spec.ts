import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormPopupComponent } from './form-popup.component';

describe('FormPopupComponent', () => {
  let component: FormPopupComponent;
  let fixture: ComponentFixture<FormPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
