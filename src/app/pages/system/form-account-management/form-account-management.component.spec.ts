import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormAccountManagementComponent } from './form-account-management.component';

describe('FormAccountManagementComponent', () => {
  let component: FormAccountManagementComponent;
  let fixture: ComponentFixture<FormAccountManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormAccountManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormAccountManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
