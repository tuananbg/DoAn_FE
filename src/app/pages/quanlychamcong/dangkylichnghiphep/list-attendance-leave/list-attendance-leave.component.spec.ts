import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAttendanceLeaveComponent } from './list-attendance-leave.component';

describe('ListAttendanceLeaveComponent', () => {
  let component: ListAttendanceLeaveComponent;
  let fixture: ComponentFixture<ListAttendanceLeaveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListAttendanceLeaveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListAttendanceLeaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
