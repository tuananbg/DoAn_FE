import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormEmployeeManagermentComponent } from './form-employee-managerment.component';

describe('FormEmployeeManagermentComponent', () => {
  let component: FormEmployeeManagermentComponent;
  let fixture: ComponentFixture<FormEmployeeManagermentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormEmployeeManagermentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormEmployeeManagermentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
