import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelAttendanceManagermentComponent } from './panel-attendance-managerment.component';

describe('PanelAttendanceManagermentComponent', () => {
  let component: PanelAttendanceManagermentComponent;
  let fixture: ComponentFixture<PanelAttendanceManagermentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PanelAttendanceManagermentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelAttendanceManagermentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
