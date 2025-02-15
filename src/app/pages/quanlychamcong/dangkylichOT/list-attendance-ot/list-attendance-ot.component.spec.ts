import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAttendanceOtComponent } from './list-attendance-ot.component';

describe('ListAttendanceOtComponent', () => {
  let component: ListAttendanceOtComponent;
  let fixture: ComponentFixture<ListAttendanceOtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListAttendanceOtComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListAttendanceOtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
