import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormAttendanceOtComponent } from './form-attendance-ot.component';

describe('FormAttendanceOtComponent', () => {
  let component: FormAttendanceOtComponent;
  let fixture: ComponentFixture<FormAttendanceOtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormAttendanceOtComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormAttendanceOtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
