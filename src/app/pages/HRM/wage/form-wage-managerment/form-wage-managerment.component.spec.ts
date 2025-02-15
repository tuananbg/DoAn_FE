import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormWageManagermentComponent } from './form-wage-managerment.component';

describe('FormWageManagermentComponent', () => {
  let component: FormWageManagermentComponent;
  let fixture: ComponentFixture<FormWageManagermentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormWageManagermentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormWageManagermentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
