import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelEmployeeManagermentComponent } from './panel-employee-managerment.component';

describe('PanelEmployeeManagermentComponent', () => {
  let component: PanelEmployeeManagermentComponent;
  let fixture: ComponentFixture<PanelEmployeeManagermentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PanelEmployeeManagermentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelEmployeeManagermentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
