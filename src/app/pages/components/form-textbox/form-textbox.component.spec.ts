import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormTextboxComponent } from './form-textbox.component';

describe('FormTextboxComponent', () => {
  let component: FormTextboxComponent;
  let fixture: ComponentFixture<FormTextboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormTextboxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormTextboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
