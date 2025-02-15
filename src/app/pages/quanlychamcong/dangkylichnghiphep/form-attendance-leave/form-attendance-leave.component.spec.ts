import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormAttendanceLeaveComponent } from './form-attendance-leave.component';

describe('FormAttendanceLeaveComponent', () => {
  let component: FormAttendanceLeaveComponent;
  let fixture: ComponentFixture<FormAttendanceLeaveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormAttendanceLeaveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormAttendanceLeaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
