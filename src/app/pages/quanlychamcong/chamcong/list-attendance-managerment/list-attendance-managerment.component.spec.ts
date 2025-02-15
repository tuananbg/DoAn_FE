import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAttendanceManagermentComponent } from './list-attendance-managerment.component';

describe('ListAttendanceManagermentComponent', () => {
  let component: ListAttendanceManagermentComponent;
  let fixture: ComponentFixture<ListAttendanceManagermentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListAttendanceManagermentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListAttendanceManagermentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
