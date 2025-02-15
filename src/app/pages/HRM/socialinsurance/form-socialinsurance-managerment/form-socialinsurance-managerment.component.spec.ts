import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormSocialinsuranceManagermentComponent } from './form-socialinsurance-managerment.component';

describe('FormSocialinsuranceManagermentComponent', () => {
  let component: FormSocialinsuranceManagermentComponent;
  let fixture: ComponentFixture<FormSocialinsuranceManagermentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormSocialinsuranceManagermentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormSocialinsuranceManagermentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
